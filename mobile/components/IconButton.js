import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Path } from 'react-native-svg';

export const CloseIcon = ({ size = 24, color = '#000' }) => (
  <Icon name="close" size={size} color={color} />
);

export const StarIcon = ({ size = 24, color = '#000', filled = false }) => (
  <Icon 
    name={filled ? "star" : "star-outline"} 
    size={size} 
    color={color} 
  />
);

export const ShareIcon = ({ size = 24, color = '#000' }) => (
  <Icon name="share-variant-outline" size={size} color={color} />
);

export const ExternalLinkIcon = ({ size = 16, color = '#fff' }) => (
  <Icon name="open-in-new" size={size} color={color} />
);

// 커스텀 열린 책 아이콘 (하단에 말풍선 꼬리 포함)
export const OpenBookIcon = ({ size = 32, color = '#4285F4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* 열린 책 전체 형태 - 위로 펼쳐진 V자 형태 (위가 넓고 아래가 좁음), 하단 중앙에 말풍선 꼬리 */}
    {/* 왼쪽 페이지 */}
    <Path
      d="M3 4C3 3.4 3.4 3 4 3H10.5C11.1 3 11.5 3.4 11.5 4V18C11.5 18.6 11.1 19 10.5 19H4C3.4 19 3 18.6 3 18V4Z"
      fill="#fff"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 오른쪽 페이지 */}
    <Path
      d="M21 4C21 3.4 20.6 3 20 3H13.5C12.9 3 12.5 3.4 12.5 4V18C12.5 18.6 12.9 19 13.5 19H20C20.6 19 21 18.6 21 18V4Z"
      fill="#fff"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 하단 중앙 말풍선 꼬리 - 작은 둥근 삼각형 */}
    <Path
      d="M11.5 19C11.2 19 11 19.2 11 19.5V21.2C11 21.5 11.2 21.7 11.5 21.7C11.8 21.7 12 21.5 12 21.2V19.5C12 19.2 11.8 19 11.5 19Z"
      fill={color}
      stroke={color}
      strokeWidth="1"
    />
  </Svg>
);
