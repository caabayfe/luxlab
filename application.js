import {navLayoutContext} from '@servicenow/aiux/aiux-components-nav';
import {i18n} from '@servicenow/aiux/aiux-services';
import {LuxLabTheme} from './theme.js';

export default {
  appTheme: LuxLabTheme,
  applicationLayout: 'aiux-nav-layout',

  setup(ctx) {
    const items = [
      {
        icon: 'home',
        title: i18n.getMessage('Overview'),
        action: {type: 'navigate', path: '/home'}
      },
      {
        icon: 'ai-sparkle',
        title: i18n.getMessage('Daily Briefing'),
        action: {type: 'navigate', path: '/briefing'}
      },
      {
        icon: 'timeline',
        title: i18n.getMessage('Incident Replay'),
        action: {type: 'navigate', path: '/replay'}
      },
      {
        icon: 'chart-pareto',
        title: i18n.getMessage('Response Patterns'),
        action: {type: 'navigate', path: '/patterns'}
      }
    ];

    // /replay/[incident] keeps Incident Replay highlighted
    const activeRoute = ctx.app?.routes?.find(r => r.active)?.route || '';
    const itemsWithActive = items.map(item => ({
      ...item,
      ...(activeRoute.startsWith(item.action.path) && {active: true})
    }));

    const current = navLayoutContext.get();
    navLayoutContext.set({
      ...current,
      appTitle: i18n.getMessage('LuxLab Cockpit'),
      features: {
        menus: false,
        logo: true,
        userSession: false,
        notifications: false,
        themeToggle: true,
        densityPicker: false,
        unifiedExperience: false,
        profile: true,
        helpPanel: false
      },
      items: itemsWithActive,
      defaultLogoFull: 'servicenow',
      defaultLogoIcon: 'servicenow'
    });
  },

  teardown() {
    navLayoutContext.set({
      items: [],
      defaultLogoFull: null,
      defaultLogoIcon: null
    });
  }
};
