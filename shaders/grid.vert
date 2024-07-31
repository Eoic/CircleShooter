precision mediump float;
attribute vec2 aPosition;
uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;

void main(void) {
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
    // gl_Position = vec4((projectionMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
}