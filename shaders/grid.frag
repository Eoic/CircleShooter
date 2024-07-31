// precision mediump float;
// varying vec2 vTextureCoord;
// uniform vec4 uColor;
// uniform float uThickness;
// uniform vec2 uGridSize;
uniform vec2 uResolution;
// uniform vec2 uOffset;
// uniform float uZoom;

void main(void) {
    // vec2 gridCoord = fract((vTextureCoord * uResolution / uZoom + uOffset) / uGridSize);
    // vec2 grid = step(vec2(uThickness), gridCoord) * step(vec2(uThickness), 1.0 - gridCoord);
    // float line = grid.x + grid.y;
    // vec3 color = mix(uColor.rgb, vec3(0.0), line);
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 color = vec3(uv.x, uv.y, 0.5);
    gl_FragColor = vec4(color, 1.0);
}