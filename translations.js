// ==============================================
// AdsOpti AI Landing Page - Translation Data
// English and Traditional Chinese (Taiwan)
// ==============================================

'use strict';

const translations = {
    // English (default)
    'en': {
        // Meta and SEO
        title: 'AdsOpti AI - Cut Ad Waste by 65% with AI Optimization',
        description: 'Join 500+ businesses testing smarter ad management. Stop wasting 44% of your ad budget.',
        
        // Navigation
        nav_badge: 'Beta Testing',
        
        // Hero Section
        urgency_bar: 'Limited Beta: {spots} of 100 spots remaining',
        hero_title_waste: '44% of Budget',
        hero_title_fix: 'Fix It in One Click.',
        hero_title_full: 'Your Ads Waste <span class="gradient-text typing-text" data-text="{waste}">44% of Budget</span>.<br><span class="typing-text" data-text="{fix}">Fix It in One Click.</span>',
        hero_subtitle: 'Join {count}+ businesses already testing smarter ad management. Average savings: $8,400/month. Setup time: 10 minutes.',
        
        // Pain Points Section
        pain_points_title: 'Which Problems Are <span class="gradient-text">Killing Your ROI?</span>',
        pain_points_subtitle: 'Click all that apply - be honest, we\'ve all been there:',
        
        pain_rising_costs_title: 'CPCs Rising Every Quarter',
        pain_rising_costs_desc: 'Google and Meta costs increased 38% YoY. You\'re paying more for the same (or worse) results.',
        pain_rising_costs_stat: '38% ↑',
        
        pain_time_waste_title: 'Weekly Manual Management',
        pain_time_waste_desc: 'Adjusting bids, reallocating budgets, creating reports. There goes your weekend... again.',
        pain_time_waste_stat: '15+ hrs',
        
        pain_attribution_title: 'Attribution Is Completely Broken',
        pain_attribution_desc: 'Since iOS 14.5, you\'re flying blind. No idea what\'s actually driving conversions.',
        pain_attribution_stat: 'iOS 14.5',
        
        pain_platform_chaos_title: 'Platform Chaos & Tab Hell',
        pain_platform_chaos_desc: 'Google, Meta, TikTok, Microsoft... Each with different interfaces, metrics, and reports.',
        pain_platform_chaos_stat: '5+ Tools',
        
        pain_competition_title: 'Competing With Enterprise Budgets',
        pain_competition_desc: 'They have teams and tools you can\'t afford. It\'s David vs. Goliath, and Goliath has AI.',
        pain_competition_stat: '10x Budget',
        
        pain_no_insights_title: 'No Idea What\'s Actually Working',
        pain_no_insights_desc: 'Mountains of data, zero actionable insights. Analysis paralysis is real.',
        pain_no_insights_stat: '???',
        
        // ROI Calculator
        roi_title: 'Calculate Your <span class="gradient-text">Potential Savings</span>',
        roi_subtitle: 'See what AdsOpti AI could save you monthly:',
        roi_monthly_spend_label: 'Your Monthly Ad Spend',
        roi_monthly_spend_placeholder: 'e.g., 10000',
        roi_monthly_spend_help: 'Enter your total monthly advertising spend',
        roi_current_roas_label: 'Current ROAS (Return on Ad Spend)',
        roi_current_roas_help: 'How much revenue do you get per dollar spent?',
        roi_result_text: 'Estimated Monthly Savings:',
        roi_result_time: 'Plus ~15 hours of time back',
        
        roi_options: {
            select: 'Select your current ROAS',
            '1.5': '1.5x or less',
            '2': '2x',
            '2.5': '2.5x',
            '3': '3x',
            '3.5': '3.5x or more'
        },
        
        // Form Section
        form_title: 'Get Your <span class="gradient-text">Custom Solution</span>',
        form_subtitle: 'Takes 60 seconds. No spam. Real humans respond.',
        form_progress: '{percent}% Complete',
        
        // Form Fields
        email_label: 'Work Email',
        email_placeholder: 'you@company.com',
        company_label: 'Company Name',
        company_placeholder: 'Your Company',
        role_label: 'Your Role',
        role_placeholder: 'Select your role',
        
        role_options: {
            'marketing-manager': 'Marketing Manager',
            'agency-owner': 'Agency Owner/Director',
            'ecommerce': 'E-commerce Manager',
            'founder': 'Founder/CEO',
            'growth': 'Growth/Performance Marketer',
            'other': 'Other'
        },
        
        ad_spend_label: 'Monthly Ad Spend',
        ad_spend_options: {
            '1k-5k': '$1,000 - $5,000',
            '5k-25k': '$5,000 - $25,000',
            '25k-50k': '$25,000 - $50,000',
            '50k+': '$50,000+'
        },
        
        features_label: 'Which features would solve your biggest pain? (Check all that apply)',
        features_options: {
            'real-time-optimization': 'Real-time bid optimization across platforms',
            'unified-dashboard': 'Unified dashboard for all platforms',
            'automated-testing': 'Automated A/B creative testing',
            'budget-allocation': 'AI budget allocation',
            'competitor-intel': 'Competitor ad intelligence',
            'slack-alerts': 'Slack/email alerts for anomalies',
            'white-label': 'White-label reporting for clients'
        },
        
        pricing_label: 'What would you pay monthly for 65% ad waste reduction?',
        pricing_options: {
            '99-199': '$99-199 (Starter)',
            '200-399': '$200-399 (Growth)',
            '400-699': '$400-699 (Scale)',
            'performance': 'Performance-based (% of savings)'
        },
        
        frustration_label: 'What\'s your #1 ad management frustration?',
        frustration_placeholder: 'Be specific - the more detail, the better we can help',
        
        submit_button: 'Get Early Beta Access →',
        loading_text: 'Processing your request...',
        success_message: '🎉 Perfect! Check your email in the next 24 hours for your personalized solution + beta access details.',
        
        privacy_promise: '<strong>Privacy Promise:</strong> We\'ll only use your info to send you beta access details and product updates. No spam, no sharing with third parties. You can unsubscribe anytime.',
        
        // Social Proof
        social_proof_title: 'Early Validation Metrics',
        social_proof_stats: {
            businesses: 'Businesses Interested',
            willing: 'Willing to Pay (%)',
            roi: 'Expected ROI (x)',
            savings: 'Avg Monthly Savings ($k)'
        },
        
        // Countdown Timer
        countdown_title: 'Beta Spots Close In:',
        countdown_labels: {
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds'
        },
        
        // Footer
        footer_copyright: '© 2025 AdsOpti AI - Market Validation Phase',
        footer_validation: 'This is a validation page to test market demand before development',
        
        // Exit Popup
        exit_popup_title: 'Wait! Don\'t miss out on 65% ad waste reduction',
        exit_popup_text: 'Join 500+ businesses already saving thousands monthly. Get notified when we launch:',
        exit_popup_placeholder: 'Enter your email',
        exit_popup_button: 'Notify Me',
        exit_popup_thanks: 'Thank you!',
        exit_popup_thanks_text: 'We\'ll notify you as soon as we launch. Keep an eye on your inbox!',
        
        // Activity Notifications
        activity_actions: [
            'joined the beta',
            'calculated ROI',
            'completed signup',
            'joined from {location}',
            'calculated ${amount}k savings',
            'completed survey'
        ],
        
        // Validation Messages
        validation: {
            required: 'This field is required',
            email_invalid: 'Please enter a valid email address',
            processing_error: 'An error occurred. Please try again.'
        },
        
        // Language Switcher
        language_switcher_label: 'Language',
        languages: {
            'en': 'English',
            'zh-TW': '繁體中文'
        }
    },
    
    // Traditional Chinese (Taiwan)
    'zh-TW': {
        // Meta and SEO
        title: 'AdsOpti AI - 用AI優化減少65%廣告浪費',
        description: '加入500+家企業測試更智能的廣告管理。停止浪費44%的廣告預算。',
        
        // Navigation
        nav_badge: '測試版',
        
        // Hero Section
        urgency_bar: '限量測試版',
        hero_title_waste: '44%的預算',
        hero_title_fix: '一鍵解決。',
        hero_title_full: '您的廣告浪費了<span class="gradient-text typing-text" data-text="{waste}">44%的預算</span>。<br><span class="typing-text" data-text="{fix}">一鍵解決。</span>',
        hero_subtitle: '加入{count}+家企業，正在測試更智能的廣告管理。平均節省：每月$8,400美元。設置時間：10分鐘。',
        
        // Pain Points Section
        pain_points_title: '哪些問題正在<span class="gradient-text">扼殺您的投資回報率？</span>',
        pain_points_subtitle: '點擊所有適用選項 - 誠實點，我們都經歷過：',
        
        pain_rising_costs_title: '每季CPC持續上漲',
        pain_rising_costs_desc: 'Google和Meta成本年增38%。您花更多錢卻得到同樣（或更差）的結果。',
        pain_rising_costs_stat: '38% ↑',
        
        pain_time_waste_title: '每週手動管理',
        pain_time_waste_desc: '調整出價、重新分配預算、製作報告。又是一個消失的週末...',
        pain_time_waste_stat: '15+ 小時',
        
        pain_attribution_title: '歸因完全失效',
        pain_attribution_desc: '自iOS 14.5以來，您在盲目飛行。完全不知道什麼真正在推動轉換。',
        pain_attribution_stat: 'iOS 14.5',
        
        pain_platform_chaos_title: '平台混亂與分頁地獄',
        pain_platform_chaos_desc: 'Google、Meta、TikTok、Microsoft...每個都有不同的介面、指標和報告。',
        pain_platform_chaos_stat: '5+ 工具',
        
        pain_competition_title: '與企業級預算競爭',
        pain_competition_desc: '他們有您負擔不起的團隊和工具。這是大衛對戰巨人歌利亞，而歌利亞有AI。',
        pain_competition_stat: '10倍預算',
        
        pain_no_insights_title: '完全不知道什麼有效',
        pain_no_insights_desc: '數據如山，但零可操作洞察。分析癱瘓是真實存在的。',
        pain_no_insights_stat: '???',
        
        // ROI Calculator
        roi_title: '計算您的<span class="gradient-text">潛在節省</span>',
        roi_subtitle: '看看AdsOpti AI每月能為您節省多少：',
        roi_monthly_spend_label: '您的月度廣告支出',
        roi_monthly_spend_placeholder: '例如：10000',
        roi_monthly_spend_help: '輸入您的總月度廣告支出',
        roi_current_roas_label: '目前的ROAS（廣告支出回報率）',
        roi_current_roas_help: '每花費一美元您能獲得多少收入？',
        roi_result_text: '預計月度節省：',
        roi_result_time: '另外節省約15小時時間',
        
        roi_options: {
            select: '選擇您目前的ROAS',
            '1.5': '1.5倍或更少',
            '2': '2倍',
            '2.5': '2.5倍',
            '3': '3倍',
            '3.5': '3.5倍或更多'
        },
        
        // Form Section
        form_title: '獲取您的<span class="gradient-text">客製化解決方案</span>',
        form_subtitle: '僅需60秒。無垃圾郵件。真人回覆。',
        form_progress: '完成{percent}%',
        
        // Form Fields
        email_label: '工作信箱',
        email_placeholder: 'you@company.com',
        company_label: '公司名稱',
        company_placeholder: '您的公司',
        role_label: '您的職位',
        role_placeholder: '選擇您的職位',
        
        role_options: {
            'marketing-manager': '行銷經理',
            'agency-owner': '代理商負責人/總監',
            'ecommerce': '電商經理',
            'founder': '創辦人/執行長',
            'growth': '成長/績效行銷專家',
            'other': '其他'
        },
        
        ad_spend_label: '月度廣告支出',
        ad_spend_options: {
            '1k-5k': '$1,000 - $5,000',
            '5k-25k': '$5,000 - $25,000',
            '25k-50k': '$25,000 - $50,000',
            '50k+': '$50,000+'
        },
        
        features_label: '哪些功能能解決您最大的痛點？（勾選所有適用項目）',
        features_options: {
            'real-time-optimization': '跨平台即時競價優化',
            'unified-dashboard': '所有平台統一儀表板',
            'automated-testing': '自動化A/B創意測試',
            'budget-allocation': 'AI預算分配',
            'competitor-intel': '競爭對手廣告情報',
            'slack-alerts': 'Slack/郵件異常警報',
            'white-label': '客戶白標報告'
        },
        
        pricing_label: '為了減少65%廣告浪費，您願意每月付費多少？',
        pricing_options: {
            '99-199': '$99-199（入門版）',
            '200-399': '$200-399（成長版）',
            '400-699': '$400-699（擴展版）',
            'performance': '績效導向（節省百分比）'
        },
        
        frustration_label: '您在廣告管理上最大的困擾是什麼？',
        frustration_placeholder: '請具體說明 - 越詳細，我們越能幫助您',
        
        submit_button: '獲取早期測試版權限 →',
        loading_text: '正在處理您的請求...',
        success_message: '🎉 完美！請在24小時內查看您的信箱，獲取個人化解決方案和測試版權限詳情。',
        
        privacy_promise: '<strong>隱私承諾：</strong>我們只會使用您的資訊發送測試版權限詳情和產品更新。無垃圾郵件，不與第三方分享。您隨時可以取消訂閱。',
        
        // Social Proof
        social_proof_title: '早期驗證指標',
        social_proof_stats: {
            businesses: '感興趣的企業',
            willing: '願意付費（%）',
            roi: '預期投資回報率（倍）',
            savings: '平均月度節省（$k）'
        },
        
        // Countdown Timer
        countdown_title: '測試版名額截止倒計時：',
        countdown_labels: {
            days: '天',
            hours: '小時',
            minutes: '分鐘',
            seconds: '秒'
        },
        
        // Footer
        footer_copyright: '© 2025 AdsOpti AI - 市場驗證階段',
        footer_validation: '這是一個驗證頁面，用於在開發前測試市場需求',
        
        // Exit Popup
        exit_popup_title: '等等！別錯過65%廣告浪費減少機會',
        exit_popup_text: '加入500+家企業，每月已節省數千美元。在我們發佈時獲得通知：',
        exit_popup_placeholder: '輸入您的郵箱',
        exit_popup_button: '通知我',
        exit_popup_thanks: '謝謝您！',
        exit_popup_thanks_text: '我們會在發佈時立即通知您。請留意您的收件夾！',
        
        // Activity Notifications
        activity_actions: [
            '加入了測試版',
            '計算了投資回報率',
            '完成了註冊',
            '從{location}加入',
            '計算了${amount}k節省',
            '完成了調查'
        ],
        
        // Validation Messages
        validation: {
            required: '此欄位為必填',
            email_invalid: '請輸入有效的信箱地址',
            processing_error: '發生錯誤，請重試。'
        },
        
        // Language Switcher
        language_switcher_label: '語言',
        languages: {
            'en': 'English',
            'zh-TW': '繁體中文'
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
