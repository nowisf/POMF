shader_type canvas_item;

//varying vec4 vertex_color;
void vertex() {
	//if (VERTEX.g < 0.0){
  			//vertex_color = COLOR;
			VERTEX += vec2(sin(TIME *3.5) * 1.4, sin(1600.0 + TIME *3.5) * 1.4 );

	//}
}
