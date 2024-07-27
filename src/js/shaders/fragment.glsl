uniform float time;
uniform float progress;
uniform float rgbStrength;
uniform float rgbOpacity;
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;

uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main() {
    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    vec4 color = texture2D(uTexture, newUV);
    vec4 offset = texture2D(uDataTexture, vUv);

    // Chromatic Aberration code
    vec2 redUV = newUV + vec2(-rgbStrength, 0.0) * offset.rg;
    vec2 greenUV = newUV + vec2(0.0, rgbStrength) * offset.rg;
    vec2 blueUV = newUV + vec2(rgbStrength, -rgbStrength) * offset.rg;

    float red = texture2D(uTexture, redUV).r;
    float green = texture2D(uTexture, greenUV).g;
    float blue = texture2D(uTexture, blueUV).b;

    vec4 distortedColor = vec4(red, green, blue, 1.0);

    // Mix the color with original based on mouse movement and rgbOpacity
    float mixFactor = clamp(length(offset.rg) * rgbOpacity, 0.0, 1.0);
    color = mix(color, distortedColor, mixFactor);

    gl_FragColor = color;
}
