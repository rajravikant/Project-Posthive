import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';

interface PostImagePickerProps {
    imageAsset: ImagePicker.ImagePickerAsset | null;
    onImageSelected: (image: ImagePicker.ImagePickerAsset) => void;
    deafaultImage?: string;
}

export default function PostImagePicker({ imageAsset, onImageSelected, deafaultImage }: PostImagePickerProps) {

    // const [imagePickerResult, setImagePickerResult] = useState<ImagePicker.ImagePickerAsset | null>(null);

     const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      
    });

   if (!result.canceled) {
    //  setImagePickerResult(result.assets[0]);
    onImageSelected(result.assets[0]);
   }

  };

  return (
    <View>
      <TouchableOpacity
              className={
                "flex-row relative items-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-xl h-56 w-full overflow-hidden p-4 "
              }
              onPress={pickImage}
            >

        <View className="flex-1 justify-center items-center">
          {imageAsset || deafaultImage ? (
            <Image source={{ uri: imageAsset?.uri || deafaultImage }} className="w-full h-full" />
          ) : (
            <CustomText className="text-gray-500">No image selected</CustomText>
          )}
        </View>

      </TouchableOpacity>
    </View>
  )
}