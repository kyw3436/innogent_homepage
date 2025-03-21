document.addEventListener('DOMContentLoaded', function() {
    // FAQ 토글 기능
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // 초기에는 답변을 숨김
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 모든 FAQ 항목을 닫음
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0';
            });

            // 클릭한 항목이 이미 활성화되어 있지 않으면 활성화
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 스크롤 애니메이션 효과
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 관찰할 요소들
    const animateElements = [
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.ai-foundry-grid'),
        ...document.querySelectorAll('.value-card'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.tech-segment'),
        ...document.querySelectorAll('.process-step'),
        ...document.querySelectorAll('.solution-card'),
        ...document.querySelectorAll('.faq-item')
    ];

    // 관찰 시작
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// 애니메이션용 CSS를 동적으로 추가
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }

    .ai-foundry-grid.fade-in .ai-foundry-content {
        transition-delay: 0.2s;
    }

    .ai-foundry-grid.fade-in .ai-foundry-image {
        transition-delay: 0.4s;
    }

    .value-card.fade-in,
    .service-card.fade-in,
    .tech-segment.fade-in,
    .solution-card.fade-in,
    .faq-item.fade-in {
        transition-delay: calc(var(--i, 0) * 0.1s);
    }

    .value-card:nth-child(1) { --i: 1; }
    .value-card:nth-child(2) { --i: 2; }
    .value-card:nth-child(3) { --i: 3; }

    .service-card:nth-child(1) { --i: 1; }
    .service-card:nth-child(2) { --i: 2; }
    .service-card:nth-child(3) { --i: 3; }

    .tech-segment:nth-child(1) { --i: 1; }
    .tech-segment:nth-child(2) { --i: 2; }
    .tech-segment:nth-child(3) { --i: 3; }
    .tech-segment:nth-child(4) { --i: 4; }

    .process-step:nth-child(1) { --i: 1; }
    .process-step:nth-child(2) { --i: 2; }
    .process-step:nth-child(3) { --i: 3; }

    .solution-card:nth-child(1) { --i: 1; }
    .solution-card:nth-child(2) { --i: 2; }
    .solution-card:nth-child(3) { --i: 3; }

    .faq-item:nth-child(1) { --i: 1; }
    .faq-item:nth-child(2) { --i: 2; }
    .faq-item:nth-child(3) { --i: 3; }
`;
document.head.appendChild(style);
