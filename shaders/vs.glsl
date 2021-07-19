#version 300 es

in vec3 a_position;
in vec2 a_uv;
in vec3 inNormal;

out vec3 fsNormal;
out vec2 uvFS;
out vec3 fsPos;

uniform mat4 matrix;        //world-view-projection
uniform mat4 nMatrix;     //matrix to transform normals (that is built with the world-view one)
uniform mat4 worldViewMatrix;

void main() {

  //output varyings to pass to the fragment shaders
  uvFS = a_uv;

  //-----Phong shading: transforming the vertex position and normal directions in the vertex shader, and passing the resulting vectors to the fragment shader
  fsPos = normalize(-(worldViewMatrix * vec4(a_position,1.0)).xyz);
  fsNormal = mat3(nMatrix) * inNormal; //normals are transformed by means of the inverse transpose of the transformation matrix
  //-----------------------------------------

  /* The Phong shading method is much more expensive than the 
	Gouraud method because it requires the solution of the 
	rendering equation for every pixel. Here the light model implemented is very simple, therefore we take this risk. */ 
  

  gl_Position = matrix * vec4(a_position,1.0); 
 
}
