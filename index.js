var camera, scene, renderer;
var container;
var ambientLight, pointLight;
init();
animate();

var camera, scene, renderer;
var container;
var ambientLight, pointLight;

// 初始化
init()
    // 循环渲染每一帧  一帧一帧的 就是你打游戏时的FPS
animate()

function init() {
    // 初始化相机 
    // 这里使用的是透视相机来模拟人眼看到的效果 近大远小
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.z = 70;
    camera.position.x = 50;
    camera.position.y = 10;

    // 初始化场景
    scene = new THREE.Scene();

    // 初始化灯光
    // 环境光 能保持整体都是亮点
    ambientLight = new THREE.AmbientLight(0x404040)
        // 点光源 就像灯泡一样的效果  白色灯光 亮度0.6
    pointLight = new THREE.PointLight(0xffffff, 0.6);

    // 将灯光加入到场景中
    scene.add(ambientLight)
        // 将灯光加到摄像机中 点光源跟随摄像机移动
        // 为什么这样做  因为这样可以让后期处理时的辉光效果更漂亮 
    camera.add(pointLight);

    // 我们将摄像机加入到场景中
    scene.add(camera);

    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({
        // 开启抗锯齿
        antialias: true,
        // 开启背景透明
        alpha: true
    });
    // 把自动清除颜色缓存关闭 这个如果不关闭 后期处理这块会不能有效显示
    // 书上的描述是 如果不这样做，每次调用效果组合器的render()函数时，之前渲染的场景会被清理掉。通过这种方法，我们只会在render循环开始时，把所有东西清理一遍。
    renderer.autoClear = false;
    // 背景透明 配合 alpha
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 伽马值启动 更像人眼观察的场景
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    // 渲染到DOM中去
    container = document.createElement("div");
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
}
// 这样一来，基础场景创建就完成了，接下来我们来让它循环渲染起来

function animate() {
    // 这个方法低版本浏览器兼容不好 可以从github上找些兼容库 如果要兼容低版本浏览器
    requestAnimationFrame(animate);
    // 渲染我们的场景  摄像机啪啪啪的拍和录
    // 由于把renderer autoClear  关闭了 所以我们要在渲染函数中手动清除
    renderer.clear();
    renderer.render(scene, camera);
}
// ok 基础部分完成 接下来我们来加载模型
// 加载的过程 
var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
};

var onError = function() {
    // 载入出错时候
};

var loader = new GLTFLoader().setPath('./node_modules/three/examples/js/libs/draco/gltf');
loader.load('./lib/scene.gltf', function(gltf) {

        scene.add(gltf.scene)
    },
    onProgress,
    onError
);