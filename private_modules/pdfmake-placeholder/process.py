import fontforge
font = fontforge.open("./SourceHanSansVF-ExtraLight.sfd")
def make(start, end):
	start_code = start
	end_code = end
	for code in range(start_code, end_code + 1):
		if(code==0x6f22): continue
		if(code not in font): continue
		target_glyph = font.createChar(code)
		target_glyph.width = font[0x6c49].width
		pen = target_glyph.glyphPen() 
		pen.addComponent("uni6F22")
		pen = None
		#print(target_glyph.foreground)

make(0x2e80, 0x2e6ea)

font.save("./Modified.sfd")