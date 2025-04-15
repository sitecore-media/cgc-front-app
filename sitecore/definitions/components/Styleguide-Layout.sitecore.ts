import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Styleguide-Layout component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function StyleguideLayout(manifest: Manifest) {
  manifest.addComponent({
    name: 'StyleguideLayout',
    templateName: 'StyleguideLayout',
    icon: SitecoreIcon.Layout,
    placeholders: ['jss-styleguide-layout'],
  });
}
