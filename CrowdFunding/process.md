1. Anchorの設定。Ethereumに例えると、「Foundry + Solidityのアタ安全性をRustにもたらすフレームワークです。」
    anchor init crowdfunding

2. crowdfundingフォルダへ移動(cd crowdfunding)して、
   anchor buildとうつ。
   「Rust のプログラムを Solana 用にビルドし、そのインターフェース（IDL）と TypeScript の型をまとめて生成する」 のが anchor build です。デプロイ前の準備や、フロント／テストからプログラムを呼ぶための土台を作るコマンド、というイメージです。

3. programs/crowdfunding/Cargo.tomlに
    [dependencies]
    anchor-lang = "0.32.1"
    とあり、これでAnchaorのバージョンをシテイルすることが出来る。

4. target/idl/crowdfunding.jsonに
　　プログラムの IDL（Interface Definition Language） を自動生成します。
    IDL には「どのインストラクションがあるか」「引数・アカウントの型」などが JSON で書かれ、フロントやクライアントがプログラムとやりとりするときの「型付きの仕様書」になります。
　　があります。

5. lib.rsを作成

理由は「誰が SOL を動かしているか」の違いです。

Withdraw（system_program が不要な理由）
Withdraw では プログラム内で lamports を直接書き換えています。


lib.rs
Lines 28-33
        let campaign_info = campaign.to_account_info();
        let mut campaign_lamports = campaign_info.try_borrow_mut_lamports()?;
        **campaign_lamports = (*campaign_lamports).saturating_sub(amount);
        let user_info = user.to_account_info();
        let mut user_lamports = user_info.try_borrow_mut_lamports()?;
        **user_lamports = (*user_lamports).saturating_add(amount);
キャンペーンとユーザーのアカウントの lamports を直接増減しているだけ。
System Program は呼んでいない（CPI していない）。
だから Withdraw のアカウントリストに system_program を載せる必要はありません。
Donate（system_program が必要な理由）
Donate では System Program の transfer を CPI で呼んでいます。


lib.rs
Lines 37-46
    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.campaign.key(),
            amount
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[ctx.accounts.user.to_account_info(), ctx.accounts.campaign.to_account_info()]
        );
system_instruction::transfer で「送金」用のインストラクションを作り、invoke で System Program を呼び出している（CPI）。
Solana では「呼び出すプログラム」も アカウントとして 渡す必要があります。
そのため、Donate の Context に system_program: Program<'info, System> を入れておく必要があります。
（実際に invoke に渡すアカウントリストにも、通常は ctx.accounts.system_program.to_account_info() を含めます。）
まとめ
インストラクション	SOL の動かし方	system_program が必要か
Withdraw	プログラム内で lamports を直接書き換え	不要（System Program を呼ばない）
Donate	System Program の transfer を CPI で実行	必要（呼び出すプログラムとして渡す）
「別プログラム（ここでは System Program）を invoke するなら、そのプログラムをアカウントとして渡す」という Solana のルールのため、Donate だけ system_program が必要になります。



　 

