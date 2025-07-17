import { v4 as uuidv4 } from "uuid";
import  imageCompression from "browser-image-compression";
import { supabase } from "../supabaseClient";

function getStorage() {
   
    return supabase.storage
}

export async function uploadImage(file, bucket, folder) {
    console.log(file, bucket, folder);

    let compressedFile;
    let path;

    try {
        const compressedBlob = await imageCompression(file, {
            maxSizeMB: 1,
        });

        const compressedExtension = compressedBlob.type.split("/")[1]; // e.g. "webp"
        const uniqueName = `${uuidv4()}.${compressedExtension}`;

        path = `${folder ? folder + "/" : ""}${uniqueName}`;

        compressedFile = new File(
            [compressedBlob],
            uniqueName,
            { type: compressedBlob.type }
        );

        console.log("Compressed file", compressedFile);
    } catch (error) {
        console.log(error);
        return { imageUrl: "", error: "Image compression error" };
    }

    const storage = getStorage();
  const { data, error } = await storage.from(bucket).upload(path, compressedFile, {
    upsert: true
});

    if (error) {
        return { imageUrl: "", error: "Image upload failed" };
    }

    const ImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data?.path}`;
    return { imageUrl: ImageUrl, error: "" };
}
