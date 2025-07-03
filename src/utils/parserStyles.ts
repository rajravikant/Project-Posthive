import { Fonts } from "@/constants/theme";
import { colorScheme } from "nativewind";
import { StyleProp, ViewStyle } from "react-native";

const isDark = colorScheme.get() === "dark"

export const colors = {
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



export const textStyles = {
  p: {marginVertical: 8, fontSize: 16,fontFamily: Fonts.Regular ,...colors.p},
  strong: { fontWeight: 'bold', fontFamily: Fonts.Bold ,...colors.strong },
  b: { fontWeight: 'bold' , fontFamily: Fonts.Bold ,...colors.b},
  em: { fontStyle: 'italic' ,...colors.em},
  i: { fontStyle: 'italic', fontFamily: Fonts.Regular ,...colors.i},
  u: { textDecorationLine: 'underline' , fontFamily: Fonts.Regular ,...colors.u},
  a: { textDecorationLine: 'underline' , fontFamily: Fonts.Regular ,...colors.a},
  h1: { fontSize: 28, fontFamily : Fonts.SemiBold , ...colors.h1},
  h2: { fontSize: 24, fontFamily : Fonts.SemiBold ,...colors.h2 },
  h3: { fontSize: 20, fontFamily : Fonts.SemiBold , ...colors.h3},
  h4: { fontSize: 18, fontFamily : Fonts.SemiBold , ...colors.h4},
  h5: { fontSize: 16, fontFamily : Fonts.SemiBold , ...colors.h5},
  h6: { fontSize: 14, fontFamily : Fonts.SemiBold , ...colors.h6},
  code: { fontFamily: 'Courier New', fontSize: 14,...colors.code },
  pre: { fontFamily: 'Courier New' , fontSize: 14,padding : 8,...colors.pre },
  li: { fontSize: 16, lineHeight: 24, fontFamily: Fonts.Regular , ...colors.li },
  span: {},
};
export const viewStyles: Record<string, StyleProp<ViewStyle>> = {
   ul: { marginBottom: 8, paddingLeft: 5, },
    ol: { marginBottom: 8, paddingLeft: 5,  },
    li: {flexDirection: 'row', alignItems: 'center'},
    pre: { marginVertical: 4,borderRadius:4, overflow:"hidden", ...colors.pre },
    code: {padding:2 , ...colors.code },
  div: {},
};
export const imageStyles = {
  img: { width: '100%', height: 200, marginVertical: 8, borderRadius: 8 },
};