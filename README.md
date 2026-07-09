# Vite+ Monorepo Starter

A starter for creating a Vite+ monorepo.

## Development

[Node.js platform list](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list)

| Node.js platform          | Go distribution   |
| ------------------------- | ----------------- |
| `linux` `x64` `glibc`     | `linux` `amd64`   |
| `linux` `x64` `musl`      | `linux` `amd64`   |
| `linux` `ia32` `glibc`    | `linux` `386`     |
| `linux` `arm64` `glibc`   | `linux` `arm64`   |
| `linux` `arm` `glibc`     | `linux` `arm`     |
| `linux` `ppc64` `glibc`   | `linux` `ppc64le` |
| `linux` `s390x` `glibc`   | `linux` `s390x`   |
| `linux` `loong64` `glibc` | `linux` `loong64` |
| `linux` `riscv64` `glibc` | `linux` `riscv64` |
| `win32` `x64`             | `windows` `amd64` |
| `win32` `arm64`           | `windows` `arm64` |
| `darwin` `x64`            | `darwin` `amd64`  |
| `darwin` `arm64`          | `darwin` `arm64`  |
| `sunos` `x64`             | `solaris` `amd64` |
| `aix` `ppc64`             | `aix` `ppc64`     |
| `freebsd` `x64`           | `freebsd` `amd64` |
| `openharmony` `x64`       | _unknown_         |

The `generate` task in the root of the npm workspace will remove & regenerate all of the `packages/jcbhmr-go-${OS}-${CPU}/` directories. They are generate artifacts instead of build artifacts because they are intended to be included in source control. Each of the generated `packages/jcbhmr-go-${OS}-${CPU}/` packages has a `build` script that produces that package's platform-specific build artifacts.

```sh
vp run generate
```
