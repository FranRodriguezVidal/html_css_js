
const settings = {
    sizes: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    boxDimensions: {
        h: 1.4,
        w: 1,
    }
}
//textures
const textureLoader = new THREE.TextureLoader();
const photoTexture02 = textureLoader.load('https://assets.codepen.io/4201020/city2.png?format=auto');
const photoTexture03 = textureLoader.load('https://assets.codepen.io/4201020/shopp-e-1731593813681771088199459824.png');
const photoTexture = textureLoader.load('https://assets.codepen.io/4201020/shopp-e-1731594468645280783813006762.png');
photoTexture.wrapS = THREE.RepeatWrapping;
photoTexture.wrapT = THREE.RepeatWrapping;
photoTexture.repeat.set(.1, .1);
// init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, settings.sizes.width / settings.sizes.height, 0.1, 1000);
camera.position.set(0, 0, 3);
camera.lookAt(0, 0, 0);
scene.add(camera);

const sun = new THREE.AmbientLight(0xffffff, .5);
scene.add(sun);

const planeGeometry = new THREE.PlaneGeometry(settings.boxDimensions.w, settings.boxDimensions.h);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

function RoundedPortalPhotoPlane(geometry, photoTexture) {
    const material = new THREE.MeshMatcapMaterial({
        matcap: photoTexture,
        transparent: true,
    })

    material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
            #include <common>
            varying vec4 vPosition;
            varying vec2 vUv;
        `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_vertex>',
            `
              #include <fog_vertex>
              vPosition = mvPosition;
              vUv = uv;
          `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `
        #include <common>
        varying vec4 vPosition;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
            return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
          }
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <dithering_fragment>`,
            `
        #include <dithering_fragment>
  
        // The pixel space scale of the rectangle.
        vec2 size = vec2(1.0, 1.0);
        // How soft the edges should be (in pixels). Higher values could be used to simulate a drop shadow.
        float edgeSoftness  = 0.001;
        // The radius of the corners (in pixels).
        float radius = 0.08;
        // Calculate distance to edge.
        float distance  = roundedBoxSDF(vUv.xy - (size/2.0), size/2.0, radius);
        // Smooth the result (free antialiasing).
        float smoothedAlpha =  1.0-smoothstep(0.0, edgeSoftness * 2.0,distance);
        // Return the resultant shape.
        //vec4 quadColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.0, 0.2, 1.0, smoothedAlpha), smoothedAlpha);
        gl_FragColor = vec4(outgoingLight, smoothedAlpha);
        `
        );
        console.log(shader.fragmentShader);

    };
    const plane = new THREE.Mesh(
        geometry,
        material
    );

    return plane;
}

// planes
const planeGroup = new THREE.Group();

const photoPlane01 = new RoundedPortalPhotoPlane(
    planeGeometry,
    photoTexture02
);
photoPlane01.position.set(-1, 0, 1);
photoPlane01.rotation.y = Math.PI * 0.1;
photoPlane01.name = 'plane1';
planeGroup.add(photoPlane01);

const photoPlane02 = new RoundedPortalPhotoPlane(
    planeGeometry,
    photoTexture
);

photoPlane02.position.set(0, 0, 0.5);
photoPlane02.name = 'plane2';
planeGroup.add(photoPlane02);



const photoPlane03 = new RoundedPortalPhotoPlane(
    planeGeometry,
    photoTexture03
);
photoPlane03.position.set(1, 0, 1);
photoPlane03.rotation.y = Math.PI * -0.1;
photoPlane03.name = 'plane3';
planeGroup.add(photoPlane03);
scene.add(planeGroup);

const mouse = new THREE.Vector2();
let xParallaxFactor = -0.3;
let yParallaxFactor = 0.3;
//mouse events
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / settings.sizes.width * 2 - 1; //could also do it this way: map(event.clientX, 0, sizes.width, -1, 1)
    mouse.y = - (event.clientY / settings.sizes.height) * 2 + 1; //could also do it this way: map(event.clientY, 0, sizes.height, 1, -1)
});

// animation
const clock = new THREE.Clock()
let previousTime = 0;

function animation(time) {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    const parallaxX = mouse.x * xParallaxFactor;
    const parallaxY = mouse.y * yParallaxFactor;
    planeGroup.rotation.y += (parallaxX - planeGroup.rotation.y) * 3 * deltaTime;
    planeGroup.rotation.x += (parallaxY - planeGroup.rotation.x) * 3 * deltaTime;

    renderer.render(scene, camera);

}