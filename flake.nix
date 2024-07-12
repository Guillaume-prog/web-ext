{
  description = "A Nix-flake-based Shell development environment";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: with pkgs; {
        default = mkShell {
          packages = [ 
            web-ext
            nodejs_22
          ];

          shellHook = ''
            clear
            export PS1="\n\[\033[1;32m\][web-ext]\[\033[0m\]$ "
          '';
        };
      });
    };
}