#version 300 es

precision highp float;

in vec3 fsNormal;
in vec2 uvFS;
in vec3 fsPos;  

out vec4 outColor;

uniform sampler2D u_texture;
uniform vec3 mDiffColor;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform int hasTexture;
uniform float specShine;
uniform vec3 specularColor;

/* The Phong shading algorithm computes the color of each pixel separately. This is thus a per-pixel 
shading algorithm. In this case, vertex normal vectors are interpolated to approximate the 
normal vector direction to the actual surface in the internal points of a triangle. Interpolation is performed 
by considering the x, y, z components of the normal vector separately. This however may lead to interpolated 
vectors that are no longer unitary. For this reason normal vectors should be normalized at every step to restore their 
unitary size */

void main() {

    vec3 nNormal = normalize(fsNormal);
    vec3 eyeDirection = fsPos; //observer direction obtained by normalizing the object position (Camera space)

    if(hasTexture == 1){  //object has texture

        vec4 texcol = texture(u_texture, uvFS);

        // LAMBERT DIFFUSE 
        vec3 diffuseTerm = lightColor * clamp(dot(nNormal, lightDirection),0.0,1.0) * texcol.rgb;
        //vec3 diffuseTerm = texcol.rgb*diffContr; 

        // PHONG SPECULAR
        vec3 reflectDir = -reflect(lightDirection, nNormal);
        vec3 specularTerm  = lightColor * pow(clamp(dot(eyeDirection, reflectDir), 0.0, 1.0),specShine) * specularColor;
        outColor = vec4(clamp(diffuseTerm + specularTerm, 0.0, 1.0),1.0);

    }

    else{   //object does not have texture

        // LAMBERT DIFFUSE 
        vec3 diffuseTerm = lightColor * clamp(dot(nNormal, lightDirection),0.0,1.0) * mDiffColor;
        //vec3 diffuseTerm = mDiffColor*diffContr; 

        // PHONG SPECULAR
        vec3 reflectDir = -reflect(lightDirection, nNormal);
        vec3 specularTerm  = lightColor * pow(clamp(dot(eyeDirection, reflectDir), 0.0, 1.0),specShine) * specularColor;

        outColor = vec4(clamp(diffuseTerm + specularTerm, 0.0, 1.0),1.0);
    }

}
