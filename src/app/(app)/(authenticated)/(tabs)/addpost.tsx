import { usePostMutation } from "@/api/use-posts";
import ScreenWrapper from "@/components/ScreenWrapper";
import TextEditor from "@/components/texteditor";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import InputField from "@/components/ui/InputField";
import { Picker } from "@/components/ui/Picker";
import PostImagePicker from "@/components/ui/PostImagePicker";
import Separator from "@/components/ui/Separator";
import TagInputs from "@/components/ui/TagInputs";
import { categories } from "@/constants/data";
import useAuthStore from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { Link, Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";


interface Post {
  title: string;
  category: string;
  summary: string;
  tags: string[];
}

const initialPost: Post = {
  title: "",
  category: "",
  summary: "",
  tags : []
};




export default function AddNewPost() {
  const contentRef = useRef<string>("");
  const { currentUser} = useAuthStore();
  const router = useRouter();
  const [newPost, setNewPost] = useState<Post>(initialPost);
  const [imagePickerResult, setImagePickerResult] = useState<ImagePickerAsset | null>(null);
  const mutation = usePostMutation()
  const queryClient = useQueryClient();

  const handleInputChange = (
    field: keyof Post,
    value: string | File | null
  ) => {
    setNewPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const prepareData = ()=>{
    
     const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("category", newPost.category);
    formData.append("summary", newPost.summary);
    formData.append("content", contentRef.current);
    formData.append("tags", newPost.tags.join(","));
    if (imagePickerResult) {
      if (!imagePickerResult.uri) return;
      formData.append("image", {
        uri: imagePickerResult.uri,
        name: imagePickerResult.fileName,
        type: imagePickerResult.mimeType,
      } as unknown as Blob);
    }

    return formData;
  }

  const handleSubmitPost = async () => {
    if (
      !newPost.title ||
      !newPost.category ||
      !newPost.summary ||
      !imagePickerResult ||
      !newPost.tags.length ||
      !contentRef.current.trim()
    ) {
      return;
    }

    const data = prepareData();
    if (!data) return;

    mutation.mutate(data,{
      onSuccess:()=>{
       queryClient.invalidateQueries({ queryKey: ["blogs"] });
        queryClient.invalidateQueries({queryKey:["userProfile",currentUser?.username]})
        setNewPost(initialPost);
        setImagePickerResult(null);
        contentRef.current = "";
        router.canGoBack()
          ? router.back()
          : router.push("/(app)/(authenticated)/(tabs)");
      },
      onError: (error) => {
        console.error("Error publishing post:", error);
      }
    })

  };

  return (
    <ScreenWrapper style={{ paddingTop: 0 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "New Blog",
          headerRight: (props) => (
            <Button
              onPress={handleSubmitPost}
              variant="primary"
              disabled={mutation.isPending}
              loading={mutation.isPending}
              className="mr-5"
              size="lg"
            >
              <CustomText className="text-white">Publish</CustomText>
            </Button>
          ),
        }}
      />

      {mutation.isPending && (
        <View className="flex-1 justify-center items-center bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-50 inset-0">
          <CustomText>Publishing...</CustomText>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {mutation.error && (
        <View className="flex-1 justify-center items-center bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-50 inset-0">
          <CustomText className="text-red-500">
            Error publishing post
          </CustomText>
          <Link href="/(app)/(authenticated)/(tabs)">
            <CustomText className="text-blue-500">Go back to posts</CustomText>
          </Link>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="gap-4">
          <InputField
            value={newPost.title}
            onChangeText={(text) => handleInputChange("title", text)}
            placeholder="Title"
          />

          <Picker
            options={categories.map((category) => ({
              label: category,
              value: category.toLowerCase(),
            }))}
            selectedValue={newPost.category}
            onValueChange={(value) => handleInputChange("category", value)}
          />

          <TagInputs tags={newPost.tags || ['trending']} setTags={(newTags) => setNewPost(prev => ({ ...prev, tags: typeof newTags === 'function' ? newTags(prev.tags) : newTags }))} placeholder="Provide some tags" maxTags={5}/>

          <InputField
            multiline
            value={newPost.summary}
            onChangeText={(text) => handleInputChange("summary", text)}
            placeholder="Summary"
          />

          
          <PostImagePicker
            imageAsset={imagePickerResult}
            onImageSelected={(file) => setImagePickerResult(file)}
          />
        </View>

        <Separator />

        <TextEditor contentRef={contentRef} />
      </ScrollView>
    </ScreenWrapper>
  );
}
