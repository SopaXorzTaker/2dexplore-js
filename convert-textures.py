import os
import base64

textures = os.listdir("textures");

for texture in textures:
	texture = "textures/" + texture
	#if os.path.isfile(texture + ".txt"):
	#	print "Skipping %s" % texture
	if texture.endswith(".png"):
		data = open(texture, "rb").read()
		
		output = open(texture + ".txt", "w")
		output.write("data:image/png;base64," + base64.b64encode(data))
		output.flush()
		output.close()
		
raw_input()