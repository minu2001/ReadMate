document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchOption = document.getElementById('searchOption');

    // Enter 키로 검색
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchBooks();
        }
    });

    // 버튼 클릭으로 검색
    searchBtn.addEventListener('click', searchBooks);

    async function searchBooks() {
        const query = searchInput.value.trim();
        const option = searchOption.value; // 검색 옵션 (저자 또는 책 제목)

        if (!query) {
            alert('검색어를 입력해주세요.');
            return;
        }

        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '<p>검색 중...</p>';

        try {
            const response = await fetch(`/search?query=${encodeURIComponent(query)}&option=${option}`);
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('검색 오류:', error);
            resultsContainer.innerHTML = '<p>검색 중 오류가 발생했습니다.</p>';
        }
    }

    function displayResults(data) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        // 첫 번째 결과 강조
        const firstBook = data.items[0];
        const firstBookDiv = document.createElement('div');
        firstBookDiv.classList.add('first-book');

        const firstImg = document.createElement('img');
        firstImg.src = firstBook.image || '/static/img/NoPhoto.avif';
        firstImg.alt = firstBook.title || '이미지 없음';
        firstImg.style.cursor = 'pointer';
        firstImg.onclick = () => {
            window.location.href = firstBook.link;
        };

        const firstDetails = document.createElement('div');
        firstDetails.classList.add('first-book-details');
        const firstTitle = document.createElement('h2');
        firstTitle.textContent = firstBook.title || '제목 없음';

        const firstAuthor = document.createElement('p');
        firstAuthor.textContent = `저자: ${firstBook.author}`;
        const firstPublisher = document.createElement('p');
        firstPublisher.textContent = `출판: ${firstBook.publisher}`;

        const firstDescription = document.createElement('p');
        firstDescription.textContent = (firstBook.description || '설명 없음').slice(0, 400) + '...';

        firstDetails.appendChild(firstTitle);
        firstDetails.appendChild(firstAuthor);
        firstDetails.appendChild(firstPublisher);
        firstDetails.appendChild(firstDescription);

        firstBookDiv.appendChild(firstImg);
        firstBookDiv.appendChild(firstDetails);
        resultsContainer.appendChild(firstBookDiv);

        // 나머지 결과 그리드
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
document.querySelector('.menu a').addEventListener('click', () => {
    window.location.href = '/openai-search';
});
        