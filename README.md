# rn-expo

리액트 네이티브가 궁금해서 만들어본 프로젝트

## Prerequired

- `node.js`: `v20.x`
- `expo go app` & `expo go account`

## Connect to eas build

엑스포에 로그인을 하고

```bash
npm run eas login
```

아래 명령어를 실행하면 빌드 파일이 엑스포에 업로드 된다.

```
eas build --profile development-simulator --platform ios
```

Build details: https://expo.dev/accounts/sujinsujin/projects/rn-expo/builds/4d166ceb-8659-4b84-820f-a8159ef7f0ae
위 링크를 들어가서 빌드 압축파일을 다운로드 받아 해제하고 시뮬레이터에 드래그하여 시뮬레이터에 개발 빌드 파일을 설치한다.
아래 명령어를 실행하면 simulator 에 설치한 빌드파일을 실행할 수 있다.

```
npx expo start -i 
```

## Features

- nativewind
- expo-router
- 날씨 api 연동 (api.openweathermap.org)
