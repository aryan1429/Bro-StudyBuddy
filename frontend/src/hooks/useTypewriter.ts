import { useState, useEffect } from 'react';

export function useTypewriter(text: string, shouldAnimate: boolean = true, speed: number = 10) {
    const [displayedText, setDisplayedText] = useState(shouldAnimate ? '' : text);
    const [isTyping, setIsTyping] = useState(shouldAnimate);

    useEffect(() => {
        if (!shouldAnimate) {
            setDisplayedText(text);
            setIsTyping(false);
            return;
        }

        // Reset if text changes significantly
        setDisplayedText('');
        setIsTyping(true);

        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, shouldAnimate, speed]);

    return { displayedText, isTyping };
}
