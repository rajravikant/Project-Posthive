import { updateUserProfile } from "@/api/auth";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import InputField from "@/components/ui/InputField";
import useAuthStore from "@/store/authStore";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";


interface EditProfileData {
  username?: string;
  email?: string;
  password: string | null;
  profilePicture: ImagePickerAsset | null;
}



export default function EditProfile() {
    const {currentUser,updateUserInfo} = useAuthStore()
    const router = useRouter()
    const client = useQueryClient()
  const [data, setData] = useState<EditProfileData>({
    username : currentUser?.username || "",
    email: currentUser?.email || "",
    profilePicture: null,
    password: null,
  });

  const editMutation = useMutation({
    mutationFn : (data:FormData)=>updateUserProfile(data)
  })
  const onChangeHandler = (e: any) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [3,3],
        base64: true,
        
      });
  
     if (!result.canceled) {
         setData((prevData) => ({
           ...prevData,
           profilePicture: result.assets[0],
         }));
       }
     };



    const handleSubmit = async () => {
      const formData = new FormData();
      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);
      if (data.profilePicture) {
        formData.append("avatar",  {
          uri: data.profilePicture.uri,
          name: data.profilePicture.fileName,
          type: data.profilePicture.mimeType,
        } as unknown as Blob);
      }
    

      editMutation.mutate(formData,{
        onSuccess: ({updatedUser}) => {
          // @ts-ignore
          client.invalidateQueries("userProfile",updatedUser.username);
          updateUserInfo(updatedUser);
          
          router.back();
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            "There was an error updating your profile. Please try again later.",
            [{ text: "OK" }]
          );
          console.error("Error updating profile:", error);
        },
      });
    }

  return (
    // <Header title="Edit Profile" buttonBack />
      <View className="flex-1 p-4">
         <View className="mb-16 items-center">
          <View className="border-4 border-white dark:border-gray-900 rounded-full">
            <Avatar uri={data.profilePicture?.uri! || currentUser?.avatar!} className="size-32" />
             <TouchableOpacity onPress={pickImage}
              className="absolute right-0 bottom-0 bg-primary p-2 rounded-full" 
            >
              <Feather name="edit-2" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>
        <View className="gap-2">
            <View>
            <CustomText className="text-gray-800 dark:text-gray-200 mb-2">
                Username
            </CustomText>
            <InputField
                placeholder="Enter your name"
                value={data.username || ""}
                onChangeText={(value) =>
                onChangeHandler({ target: { name: "username", value } })
                }
            />
            </View>
            <View>
            <CustomText className="text-gray-800 dark:text-gray-200 mb-2">
                Email
            </CustomText>
            <InputField
                placeholder="Enter your email"
                value={data.email || ""}
                onChangeText={(value) =>
                onChangeHandler({ target: { name: "email", value } })
                }
            />
            </View>
            <View>
            <CustomText className="text-gray-800 dark:text-gray-200 mb-2">
                Password
            </CustomText>
            <InputField
                placeholder="leave blank to keep current password"
                value={data.password || ""}
                onChangeText={(value) =>
                onChangeHandler({ target: { name: "password", value } })
                }
            />
            </View>
        </View>
        <View className="mt-20 flex flex-row gap-2 items-center">
          <Button variant="outline" className="flex-1" onPress={()=>router.dismiss()} >
            Cancel
          </Button>
          <Button disabled={editMutation.isPending} loading={editMutation.isPending} variant="primary" className="flex-1" onPress={handleSubmit}>
            Apply Changes
          </Button>
        </View>
      </View>
  );
}



const EditIcon = () => (
  <View className="absolute right-4 bottom-4 bg-primary p-2 rounded-full">
    <Feather name="edit-2" size={18} color="#fff" />
  </View>
);