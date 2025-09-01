// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "AsyncDisplayKit",
    platforms: [
        .iOS(.v14)
    ],
    products: [
        .library(
            name: "AsyncDisplayKit",
            targets: ["AsyncDisplayKit"]
        ),
    ],
    targets: [
        .binaryTarget(
            name: "AsyncDisplayKit",
            path: "AsyncDisplayKit.xcframework"
        ),
    ]
)
