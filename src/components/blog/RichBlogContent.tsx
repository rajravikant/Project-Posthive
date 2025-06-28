import { Fonts } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import RenderHtml from 'react-native-render-html';


export default function RichBlogContent({
  content,
}: {
  content: string;
}) {
  
  // const parsedContent = useParser(content)
  const { width } = useWindowDimensions();
  const {colorScheme} = useColorScheme()
  
  const isDark = colorScheme === "dark"
  
  const colors = {
    p : { color: isDark ? '#d5d5d5' : '#000000',},
    strong: { color: isDark ? '#ffffff' : '#000000'},
    b: { color: isDark ? '#ffffff' : '#000000' },
    em: { color: isDark ? '#ffffff' : '#000000'},
    i: { color: isDark ? '#ffffff' : '#000000'},
    u: { color: isDark ? '#ffffff' : '#000000' },
    a: { color: isDark ? '#2563eb' : '#2563eb' },
    h1: { color: isDark ? '#ffffff' : '#000000' },
    h2: { color: isDark ? '#ffffff' : '#000000' },
    h3: { color: isDark ? '#ffffff' : '#000000' },
    h4: { color: isDark ? '#ffffff' : '#000000' },
    h5: { color: isDark ? '#ffffff' : '#000000' },
    h6: { color: isDark ? '#ffffff' : '#000000' },
    span: { color: isDark ? '#ffffff' : '#000000',  },
    li: { color: isDark ? '#ffffff' : '#000000' },
    pre : { color: '#ffffff' ,  backgroundColor: "#0a0a0a", },
    code: { color: isDark ? '#ffffff' : '#000000'},
  }
   const textStyles = {
    p: {marginVertical: 8, fontSize: 16,fontFamily: Fonts.Regular ,...colors.p},
    strong: { fontFamily: Fonts.Bold ,...colors.strong },
    b: {  fontFamily: Fonts.Bold ,...colors.b},
    em: { ...colors.em},
    i: { fontFamily: Fonts.Regular ,...colors.i},
    u: {  fontFamily: Fonts.Regular ,...colors.u},
    a: { fontFamily: Fonts.Regular ,...colors.a},
    h1: { fontSize: 28, fontFamily : Fonts.SemiBold , ...colors.h1},
    h2: { fontSize: 24, fontFamily : Fonts.SemiBold ,...colors.h2 },
    h3: { fontSize: 20, fontFamily : Fonts.SemiBold , ...colors.h3},
    h4: { fontSize: 18, fontFamily : Fonts.SemiBold , ...colors.h4},
    h5: { fontSize: 16, fontFamily : Fonts.SemiBold , ...colors.h5},
    h6: { fontSize: 14, fontFamily : Fonts.SemiBold , ...colors.h6},
    code: { fontFamily: 'Courier New', fontSize: 14,...colors.code },
    pre: { fontFamily: 'Courier New' , fontSize: 14,padding : 8,...colors.pre },
    li: { fontSize: 16, lineHeight: 24, fontFamily: Fonts.Regular , ...colors.li },
  };
  
  
  
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <RenderHtml
      contentWidth={width}
      source={{html : content}}
      tagsStyles={{
        h1: textStyles.h1,
        h2: textStyles.h2,
        h3: textStyles.h3,
        h4: textStyles.h4,
        h5: textStyles.h5,
        h6: textStyles.h6,
        p: textStyles.p,
        img: { width: width-20, height: 200, marginVertical: 8, borderRadius: 8,overflow: "hidden" },
        pre : textStyles.pre,
        code: textStyles.pre,
        blockquote : { paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: '#ccc', fontStyle: 'italic', ...textStyles.p },
        ul : {...textStyles.p},
        ol : {...textStyles.p},
        li : textStyles.li,
        strong: {fontWeight: 'bold',fontFamily : Fonts.Bold },
        b: {fontWeight: 'bold',fontFamily : Fonts.Bold },
        em: { fontStyle: 'italic', ...textStyles.em },
        i: { fontStyle: 'italic', ...textStyles.i },
        u: { textDecorationLine: 'underline', ...textStyles.u },
        a: {textDecorationColor : "#2563eb",...textStyles.a},
      }}
    />
    </View>
  );
}


