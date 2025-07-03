import { useColorScheme } from "nativewind";
import React, { useCallback, useRef } from "react";
import { ScrollView, Text } from "react-native";
import {
  actions,
  IconRecord,
  RichEditor,
  RichToolbar
} from "react-native-pell-rich-editor";
import Separator from "../ui/Separator";

export default function TextEditor({
  contentRef,
  initialValue = "",
}: {
  contentRef: React.RefObject<string>;
  initialValue?: string;
}) {
  const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);

  const { colorScheme } = useColorScheme();
  const contentStyle = {
    backgroundColor: colorScheme === "dark" ? "#020202" : "#fff",
    color: colorScheme === "dark" ? "#fff" : "#000",
    placeholderColor: colorScheme === "dark" ? "#aaa" : "#666",
    contentCSSText: "font-size: 16px; font-family:Outfit-Regular",
    codeBackground : colorScheme === "dark" ? "#333" : "#f5f5f5",
    codeTextColor: colorScheme === "dark" ? "#fff" : "#000",
  };

  const handleChange = useCallback((html: string) => {
    contentRef.current = html;
  }, []);

  const handleCursorPosition = useCallback((scrollY: number) => {
    scrollRef.current!.scrollTo({ y: scrollY - 30, animated: true });
  }, []);



  return (
    
      <ScrollView
        nestedScrollEnabled={true}
        ref={scrollRef}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
      >
        <RichToolbar
          editor={richText}
          style={{
            backgroundColor: colorScheme === "dark" ? "#020202" : "#fff",
            borderColor: colorScheme === "dark" ? "#444" : "#ccc",
            borderWidth: 1,
            borderRadius: 8,
          }}
          actions={[
            actions.heading1,
            actions.heading2,
            actions.heading3,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertOrderedList,
            actions.insertBulletsList,
            actions.blockquote,
            actions.code,
            actions.insertLink,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
          ]}
          selectedIconTint={"#2095F2"}
          disabledIconTint={"#bfbfbf"}
          iconMap={{
            [actions.heading1]: ({ tintColor }: IconRecord) => (
              <Text style={{ color: tintColor }}>H1</Text>
            ),
            [actions.heading2]: ({ tintColor }: IconRecord) => (
              <Text style={{ color: tintColor }}>H2</Text>
            ),
            [actions.heading3]: ({ tintColor }: IconRecord) => (
              <Text style={{ color: tintColor }}>H3</Text>
            ),
          }}
        />

        <Separator />

        <RichEditor
          placeholder="Write your post here..."
          initialContentHTML={initialValue}
          editorStyle={contentStyle}
          initialHeight={400}
          ref={richText}
          onChange={handleChange}
          pasteAsPlainText={true}
          scrollEnabled={true}
          style={{
            flex: 1,
            borderColor: colorScheme === "dark" ? "#444" : "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            overflow: "hidden",
            minHeight: 300,
          }}
          useContainer={true}
          onCursorPosition={handleCursorPosition}
        />
      </ScrollView>
  );
}
