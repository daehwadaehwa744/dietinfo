// scraper.js
const fs = require('fs');

async function run() {
    const TARGET_URLS = [
        'https://www.dh-seniorwelfarecenter.co.kr/about/guide_list.php',
        'https://www.dh-seniorwelfarecenter.co.kr/about/guide_list.php?boardid=diet&sk=&sw=&category=&offset=10'
    ];

    for (let i = 0; i < TARGET_URLS.length; i++) {
        try {
            // 일반 웹 브라우저인 것처럼 헤더를 위장하여 차단을 방지합니다.
            const response = await fetch(TARGET_URLS[i], {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
                }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // 가져온 HTML을 깃허브 저장소에 로컬 파일로 저장합니다.
            fs.writeFileSync(`diet_source_${i+1}.html`, html);
            console.log(`저장 성공: diet_source_${i+1}.html`);
            
        } catch (error) {
            console.error(`스크래핑 실패: ${TARGET_URLS[i]}`, error);
        }
    }
}

run();
