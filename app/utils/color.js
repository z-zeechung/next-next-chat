export function rgb2hsl(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;

	var min=Math.min(r,g,b);
	var max=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max-min;
	var h,s,l;
	if(max==min){
		h=0;
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	s=Math.round(s*100);//转换成百分比的形式
	l=Math.round(l*100);
	return [h,s,l];
}

export function hsl2rgb(h,s,l){
	var h=h/360;
	var s=s/100;
	var l=l/100;
	var rgb=[];

	if(s==0){
		rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
	}else{
		var q=l>=0.5?(l+s-l*s):(l*(1+s));
		var p=2*l-q;
		var tr=rgb[0]=h+1/3;
		var tg=rgb[1]=h;
		var tb=rgb[2]=h-1/3;
		for(var i=0; i<rgb.length;i++){
			var tc=rgb[i];
			// console.log(tc);
			if(tc<0){
				tc=tc+1;
			}else if(tc>1){
				tc=tc-1;
			}
			switch(true){
				case (tc<(1/6)):
					tc=p+(q-p)*6*tc;
					break;
				case ((1/6)<=tc && tc<0.5):
					tc=q;
					break;
				case (0.5<=tc && tc<(2/3)):
					tc=p+(q-p)*(4-6*tc);
					break;
				default:
					tc=p;
					break;
			}
			rgb[i]=Math.round(tc*255);
		}
	}
	
	return rgb;
}