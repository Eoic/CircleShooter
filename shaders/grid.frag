uniform vec2 uResolution;

void main(void) {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float i = step(0.5, uv.x);
    float j = step(0.5, uv.y);
    vec3 color = vec3(1.0 * i, 1.0 * j, 0.45);
    gl_FragColor = vec4(color, 1.0);
}