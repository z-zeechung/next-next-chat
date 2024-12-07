export async function compileLive2dModel(config?: File, model?: File, physics?: File, textures?: File[], motions?: File[], idleMotion?:File){
    const modelURL = model ? await blobToBase64(model) : "";
    const physicsURL = physics ? await blobToBase64(physics) : "";
    let texturesURL:string[] = [];
    if (textures) {
        for (const texture of textures) {
            texturesURL.push(await blobToBase64(texture));
        }
    }
    // let motionsURL:string[] = [];
    // if (motions) {
    //     for (const motion of motions) {
    //         if(motion.name != "idle.mtn"){
    //             motionsURL.push(await blobToBase64(motion));
    //         }
    //     }
    // }
    let idleMotionURL:string = idleMotion ? await blobToBase64(idleMotion) : "";
    const configObject = config ? JSON.parse(await config.text()) : {};
    const compiledConfigObject = {
        ...(configObject?.posted ? {posted: configObject?.posted} : {}),
        ...(model ? {model: modelURL} : {}),
        ...(physics ? {physics: physicsURL} : {}),
        ...(textures ? {textures: texturesURL} : {}),
        ...(configObject?.layout ? {layout: configObject?.layout} : {}),
        ...(configObject?.hit_areas ? {hit_areas: configObject?.hit_areas} : []),
        ...(configObject?.hit_areas_custom ? {hit_areas_custom: configObject?.hit_areas_custom} : {}),
        motions:{
            ...(idleMotion ? {idle: [{
                file: idleMotionURL,
                fade_in:0,
                fade_out:0
            }]} : {})
        }
    }
    if(motions){
        for(let motion of motions){
            compiledConfigObject.motions[motion.name] = [{
                file: await blobToBase64(motion),
                fade_in:500,
                fade_out:500
            }]
        }
    }
    console.log(compiledConfigObject)
    const url = URL.createObjectURL(new Blob([JSON.stringify(compiledConfigObject)], {type: "application/json"}))
    return url;
}

export function blobToBase64 (blob):Promise<string> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e) => {
			resolve((e.target as any).result)
		}
		// readAsDataURL
		fileReader.readAsDataURL(blob)
		fileReader.onerror = () => {
			reject(new Error('blobToBase64 error'))
		}
	})
}