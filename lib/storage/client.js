import { v4 as uuidv4 } from "uuid";
import  imageCompression from "browser-image-compression";
import { supabase } from "../supabaseClient";

function getStorage() {
   
    return supabase.storage
}

export async function uploadImage(file, bucket, folder) {
    // console.log('uploadImage called with:', file, bucket, folder);
   
    let compressedFile = file;
    let path;

    if (file.type.startsWith('image/')) {
        try {
            const compressedBlob = await imageCompression(file, { maxSizeMB: 1 });
            const compressedExtension = compressedBlob.type.split("/")[1];
            const uniqueName = `${uuidv4()}.${compressedExtension}`;
            path = `${folder ? folder + "/" : ""}${uniqueName}`;
            compressedFile = new File([compressedBlob], uniqueName, { type: compressedBlob.type });
        } catch (error) {
            console.log(error);
            return { imageUrl: "", error: "Image compression error" };
        }
    } else {

        const fileExtension = file.name.split('.').pop();  // safer than slice
        const uniqueName = `${uuidv4()}.${fileExtension}`;
        path = `${folder ? folder + "/" : ""}${uniqueName}`;
        compressedFile = file; // explicitly set
    }


    const storage = getStorage();
    const { data, error } = await storage.from(bucket).upload(path, compressedFile, { upsert: true });


    if (error) {
        return { imageUrl: "", error: "Image upload failed" };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    return { imageUrl, error: "" };
}