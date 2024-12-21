from flask import Flask, render_template, request, redirect, jsonify
import requests
import openai

app = Flask(__name__)

# 네이버 API 정보
CLIENT_ID = ""
CLIENT_SECRET = ""
NAVER_BOOK_API_URL = "https://openapi.naver.com/v1/search/book.json"

# OpenAI API 키 설정
openai.api_key = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('query')
    option = request.args.get('option', 'title')  # 기본 검색 옵션: 제목
    if not query:
        return jsonify({'error': '검색어를 입력해주세요.'}), 400

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

# OpenAI 검색 페이지
@app.route('/openai-search', methods=['GET'])
def openai_search_page():
    return render_template('openai_search.html')

# OpenAI API를 사용한 책 추천
@app.route('/openai-search', methods=['POST'])
def openai_search():
    data = request.get_json()
    query = data.get('query')

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
        return jsonify({'response': response['choices'][0]['message']['content'].strip()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    if __name__ == '__main__':
        app.run(debug=True)
