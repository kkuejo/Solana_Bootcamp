1. Anchorの前提パッケージのインストール
sudo apt-get update
sudo apt-get install -y build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev

2. Solana + Anchorの一括インストール
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

3. シェルを読み直し、ｚPATHを反映
source ~/.zshrc

4. インストールの確認
anchor --version

5. プロジェクトの初期化
anchor init mycalculatordapp

6. ビルド
anchor build
と打つとbuild出来る。

7. テスト
anchor test
と打つとtestが出来る。

8. ファイルの構造

Anchor プロジェクト（mycalculatordapp）の主なフォルダと役割は以下のとおり。

・programs/mycalculatordapp/
  プログラム名のフォルダ。その中に Rust で書かれた Solana プログラムのソースがある。
  - src/lib.rs … プログラムのエントリポイント。指令（initialize など）やアカウント定義を書く。
  - Cargo.toml … このプログラム用の Rust 依存関係。

・tests/
  テスト用フォルダ。TypeScript（JavaScript）でテストを書く。
  - mycalculatordapp.ts … プログラムを呼び出して動作を検証するテスト。Mocha で実行される。
  anchor test を実行すると、ローカルバリデータを起動したうえで、この tests/ 内の *.ts が実行される。

・target/
  anchor build で生成される成果物を格納するフォルダ。
  - target/deploy/ … ビルドされたプログラム（.so ファイル）。デプロイ時に使う。
  - target/idl/ … IDL（Interface Description Language）。プログラムの指令・アカウントの型情報の JSON。
  - target/types/ … IDL から生成された TypeScript の型定義。tests/ やフロントからプログラムを呼ぶときに参照する。
  ※ テストの「ソースコード」は tests/ にあり、target 内のテスト用バイナリなどはビルド結果に過ぎない。

・migrations/
  デプロイ用スクリプト。deploy.ts でプログラムをチェーンにデプロイする処理を書く。

・Anchor.toml
  プロジェクト設定。プログラム ID、クラスター（localnet/devnet/mainnet）、テスト用スクリプトや待機時間などを指定する。

9. lib.rsを作成

10. mycalculatordapp.tsを作成

11. JestとLiteSVMを使用するための設定

12. テスト
anchor test
で全ての関数が動くことを確かめました。



