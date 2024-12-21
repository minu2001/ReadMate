# ReadMate
"NAVER_API" 와 "OPENAI_API"를 사용해 만든 사용자 맞춤형 북 서칭 웹사이트
# Project1-2024-2
Ai_Software_Project1_2024_2
2024-09-12
오늘은 날씨도 별로라 학교 재낄까 하다 이교수님 수업 들으러 왔는데 좋았다.


![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![Windows 11](https://img.shields.io/badge/Windows%2011-%230079d5.svg?style=for-the-badge&logo=Windows%2011&logoColor=white)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
#Flask서버를 사용한 Backend APP.py
- CORS에러를 우회하기 위해 flask서버 활용.
## MainPage에 필요한 정보를 불러오는 소스코드드(NaverAPI)
```python
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET
    }
    params = {
        "query": query,
        "display": 21
    }

    response = requests.get(NAVER_BOOK_API_URL, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()

        # 필요한 데이터만 추출 (저자, 출판사, 링크, 이미지 등)
        for item in data.get('items', []):
            item['author'] = item.get('author', '저자 정보 없음')
            item['publisher'] = item.get('publisher', '출판사 정보 없음')
            item['description'] = item.get('description', '').replace('<b>', '').replace('</b>', '')
        return jsonify(data)
    else:
        return jsonify({'error': '네이버 API 호출 실패', 'status_code': response.status_code}), 500

@app.route('/detail', methods=['GET'])
def book_detail():
    link = request.args.get('link')  # 네이버 링크를 쿼리 파라미터로 전달
    if link:
        return redirect(link)  # 네이버 링크로 리다이렉트
    else:
        return "잘못된 요청입니다. 링크가 없습니다.", 400
```
## AI책 추천부분(OpenAI API)
- assistant에 지침을 주고 사용자의 입력에 기본 입력값을 설정
```python
    if not query:
        return jsonify({'error': '검색어를 입력해주세요.'}), 400

    try:
        # OpenAI 최신 API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for recommending books."},
                {"role": "user", "content": f"책 추천: {query}"}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
```
# NaverAPI
## 한국인을 타깃하여 사용한 책 검색 API<br>

- 책 검색결과를 나타내게 만든 JavaScript 부분.
```javascript
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('results-grid');

        data.items.slice(1).forEach((book) => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const img = document.createElement('img');
            img.src = book.image || '/static/img/NoPhoto.avif';
            img.alt = book.title || '이미지 없음';
            img.style.cursor = 'pointer';
            img.onclick = () => {
                window.location.href = book.link; // 이미지 클릭 시 상세 링크로 이동
            };

            const title = document.createElement('h3');
            title.textContent = book.title || '제목 없음';

            const author = document.createElement('p');
            author.textContent = `저자: ${book.author}`;
            const publisher = document.createElement('p');
            publisher.textContent = `출판: ${book.publisher}`;

            bookDiv.appendChild(img);
            bookDiv.appendChild(title);
            bookDiv.appendChild(author);
            bookDiv.appendChild(publisher);
            gridContainer.appendChild(bookDiv);
        });

        resultsContainer.appendChild(gridContainer);
    }
});
```
# OPEN AI 
## OPEN AI 를 사용해 사용자 맞춤형 질문에 응답.<br>

- 사용자의 입력부분을 OpenAi API를 사용해 텍스트 형태의 출력값을 가져옴
```javascript
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.innerText = content; // innerText로 줄바꿈 포함
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 하단으로 이동
    }

    // 메시지 전송 함수
    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user'); // 사용자 메시지 추가
        chatInput.value = ''; // 입력창 초기화

        try {
            const response = await fetch('/openai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
            const data = await response.json();

            if (data.response) {
                addMessage(data.response, 'assistant'); // OpenAI 응답 추가
            } else {
                throw new Error('OpenAI 응답 없음');
            }
        } catch (error) {
            console.error('오류:', error);
            addMessage('오류가 발생했습니다. 다시 시도해주세요.', 'assistant');
        }
    }
```

개발순서
1. 소스수정
2. 소스저장
3. 스테이지
4. 커밋 앤 푸쉬
5. 커밋 메시지

2024-09-19 깃허브 연동 실습
로컬에서 편집함.

2024-10-19 
CapStoneProject 중간과제 제출
이 웹사이트의 기능 :
1. 이미지 업로드 기능 : 사용자는 웹페이지에서 파일 업로드 버튼을 클릭하여 이미지를 업로드할 수 있습니다.
이 이미지는 Base64 형식으로 변환되어 서버로 전송되기 전에 텍스트 형식으로 변환됩니다. 

2. Google Vision API가 이미지 분석 결과를 반환하면, 반환된 데이터에는 이미지 속 사람들의 얼굴 정보와 감정 상태(웃는 표정, 우는 표정, 흐릿한 얼굴 등)가 포함됩니다.
감지된 얼굴이 여러 명일 경우, 각각의 얼굴에 대해 "무표정", "웃는 표정", "우는 표정", "얼굴이 흐릿함" 등의 감정 상태가 표시됩니다.

3. css를 사용해 깔끔한 디자인을 뽑아내었습니다.

1. 텍스트 기반 시스템(우리가 Json형태를 사용함.)과 호환성이 좋은 Base64 형식을 사용.
2. response.responses[0].faceAnnotations 50번쨰 줄에 있는 이코드가 로그창의 faceAnnotations
정보를 가져오는 코드이다.
3. 감정 분석 처리:
얼굴 감지 결과에 포함된 joyLikelihood, sorrowLikelihood, blurredLikelihood 값을 확인하여 
웃는 표정(joyLikelihood), 우는 표정(sorrowLikelihood), 또는 얼굴이 가려져 있거나 흐릿한 경우(blurredLikelihood)를 분석합니다.
4. i문을 접목시켜서 blurredLikelihood부터 시작해 VERY_LIKELY OR LIKELY부분이 떠있다면 출력 아니면 다음 
else if문으로 가서 다른 감정들이 해당하는지 확인하게 코딩했습니다.
5. 그 후 마지막 결과를 textArea부분에 출력되게 했습니다.
+Css
