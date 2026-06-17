** 프록시 서버 동작 안할 시 아래 코드를 index.html에 적용

index.html 코드 수정 (핵심)
이제 기존 코드에서 프록시 서버를 경유하던 복잡한 부분을 제거하고, 내 깃허브에 저장된 로컬 HTML 파일을 읽어오도록 수정합니다. 기존에 고생해서 작성하신 식단 데이터 필터링/파싱 로직은 단 한 줄도 고칠 필요가 없습니다.

index.html 파일에서 fetchWebMenu() 함수 부분을 찾아 아래와 같이 수정해 주세요.
-----------아래

// (선택) 더 이상 사용하지 않는 fetchHtmlWithProxies() 함수는 전체 삭제하셔도 됩니다.

        async function fetchWebMenu() {
            const btn = document.getElementById('rss-btn');
            const btnText = document.getElementById('rss-btn-text');
            if (!btnText) return;

            btn.disabled = true;
            btnText.innerHTML = '식단 불러오는 중... <svg class="animate-spin ml-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

            let allFoundMenus = [];
            let finalCalories = 0;

            const extractCalories = (text) => {
               // ... (이 부분은 기존에 작성하신 로직 그대로 두시면 됩니다) ...
            };

            try {
                let overallMatched = false;

                // ★ 외부 URL 대신 GitHub Action이 저장해 둔 로컬 파일 경로를 지정합니다.
                // 브라우저가 예전 캐시를 읽지 않도록 ?t=타임스탬프를 붙여 항상 최신 데이터를 불러옵니다.
                const LOCAL_TARGETS = [
                    `./diet_source_1.html?t=${new Date().getTime()}`,
                    `./diet_source_2.html?t=${new Date().getTime()}`
                ];

                for (const targetUrl of LOCAL_TARGETS) {
                    let htmlContent;
                    try {
                        // ★ 프록시 우회 없이 기본 fetch로 내 깃허브의 로컬 파일을 아주 빠르게 불러옵니다.
                        const res = await fetch(targetUrl);
                        if (!res.ok) throw new Error("로컬 파일 없음");
                        htmlContent = await res.text();
                    } catch(e) {
                        console.warn("식단 소스 파일을 찾을 수 없습니다. GitHub Actions 실행 여부를 확인하세요:", targetUrl);
                        continue; 
                    }
                    
                    let doc = new DOMParser().parseFromString(htmlContent, 'text/html');
                    let matchedInThisSource = false;

                    // -----------------------------------------------------------
                    // ★ 이 아래부터는 기존에 작성하신 아래 파싱 로직을 100% 그대로 남겨두시면 됩니다!
                    // let targetTables = Array.from(doc.querySelectorAll('table')).filter(t => { ...
                    // -----------------------------------------------------------


                    ✅ 모든 설정이 끝난 후 테스트하는 법
위 변경 사항들을 모두 깃허브에 업로드(Commit & Push)합니다.

깃허브 저장소 상단의 [Actions] 탭으로 들어갑니다.

좌측 메뉴에서 'Auto Update Diet Data'를 클릭합니다.

우측의 회색 Run workflow 버튼을 눌러 스크립트를 수동으로 한 번 실행시킵니다.

초록색 체크표시(✅)가 뜨며 완료되면, 깃허브 페이지 새로고침 후 식단 불러오기 버튼을 눌러보세요. 에러 없이 즉각적으로 식단이 로딩되는 것을 확인하실 수 있습니다.
