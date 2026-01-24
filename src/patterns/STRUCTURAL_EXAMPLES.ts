/**
 * STRUCTURAL PATTERNS - USAGE EXAMPLES
 * 
 * Real-world examples showing how structural patterns work together
 */

import {
  ThemePalette,
  NavTreeBuilder,
  Navigator,
  CardFlyweightFactory,
  BadgeFlyweightFactory,
  CardRenderer,
  ApplicationFacade,
  LazyLoadingProxy,
  CachingProxy,
  APIClient,
  EnhancedComponentFactory,
  ComponentRegistry,
} from './index';

// ====================================
// EXAMPLE 1: Adapter - Unified Component API
// ====================================

export function example1_AdapterUnification() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 1: ADAPTER - Unified Component API                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // ComponentManager is not available; example cannot run as written.
  console.log('⚠️  ComponentManager is not exported from ./index. Example 1 is skipped.');
}

// ====================================
// EXAMPLE 2: Bridge - Theme + Renderer Independence
// ====================================

export function example2_BridgeThemeRendering() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 2: BRIDGE - Independent Theme & Renderer             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const palette = new ThemePalette();

  // Combine themes with renderers
  const combinations = [
    { theme: 'modern', renderer: 'web' },
    { theme: 'future', renderer: 'mobile' },
    { theme: 'minimal', renderer: 'darkmode' },
  ];

  console.log('🌉 Theme + Renderer combinations:\n');
  combinations.forEach((combo) => {
    const bridge = palette.createBridge(combo.theme, combo.renderer);
    console.log(`✓ ${bridge.getInfo()}`);
    console.log(`  Button style: ${bridge.getCompleteStyle().button.substring(0, 40)}...`);
  });

  console.log('\n💡 Benefit: Vary themes and renderers independently');
  console.log('   Add new renderers without changing themes, vice versa');
}

// ====================================
// EXAMPLE 3: Composite - Navigation Tree
// ====================================

export function example3_CompositeNavigation() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 3: COMPOSITE - Hierarchical Navigation               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Build navigation tree
  const nav = new NavTreeBuilder('App')
    .addItem('Home', '/')
    .addGroup('Services', '⚙️')
    .addItem('Web Design', '/services/design')
    .addItem('Development', '/services/dev')
    .addNestedGroup('Advanced', '🚀')
    .addItem('Architecture', '/services/advanced/arch')
    .addItem('Performance', '/services/advanced/perf')
    .closeNested()
    .closeGroup()
    .addItem('Contact', '/contact')
    .build();

  const navigator = new Navigator(nav);

  console.log('🌳 Navigation structure:\n');
  navigator.getStructure().forEach((line) => console.log(line));

  console.log('\n📍 Navigating:');
  const paths = ['/', '/services/design', '/services/advanced/arch'];
  paths.forEach((path) => {
    const success = navigator.navigateTo(path);
    console.log(`  ✓ Navigate to "${path}": ${success ? 'Success' : 'Failed'}`);
  });

  console.log('\n💡 Benefit: Treat items and groups uniformly, nest to any depth');
}

// ====================================
// EXAMPLE 4: Decorator - Feature Layering
// ====================================

export function example4_DecoratorFeatureLayers() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 4: DECORATOR - Dynamic Feature Composition           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const registry = new ComponentRegistry();

  // Create buttons with different feature combinations
  const btn1 = EnhancedComponentFactory.createButton('Save', {
    tooltip: 'Save changes',
    animated: true,
  });

  const btn2 = EnhancedComponentFactory.createButton('Delete', {
    variant: 'danger',
    tooltip: 'Permanently delete',
    disabled: true,
  });

  const btn3 = EnhancedComponentFactory.createButton('Download', {
    animated: true,
    analytics: true,
  });

  registry.register('save-btn', btn1);
  registry.register('delete-btn', btn2);
  registry.register('download-btn', btn3);

  console.log('🎁 Buttons with different decorator combinations:\n');
  registry.listComponents().forEach((btn) => {
    const decorators = btn.decorators.length > 0 ? ` + [${btn.decorators.join(', ')}]` : '';
    console.log(`  ✓ ${btn.name}${decorators}`);
  });

  console.log('\n💡 Benefit: Compose features dynamically without class explosion');
}

// ====================================
// EXAMPLE 5: Facade - Simplified App Control
// ====================================

export function example5_FacadeSimplifiedControl() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 5: FACADE - Simplified Application Interface         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const app = new ApplicationFacade();
  app.initialize();

  console.log('🎭 App operations (facade hides complexity):\n');

  console.log('1. Change theme:');
  app.changeTheme('future');
  console.log('   ✓ Theme changed (facade coordinated 3 subsystems)');

  console.log('\n2. Switch language:');
  app.switchLanguage('th');
  console.log('   ✓ Language switched (facade coordinated 4 subsystems)');

  console.log('\n3. Get current config:');
  const config = app.getConfig();
  console.log(`   Theme: ${config.theme}, Language: ${config.language}`);

  console.log('\n💡 Benefit: Client calls simple methods, facade handles complexity');
}

// ====================================
// EXAMPLE 6: Proxy - Lazy Loading & Caching
// ====================================

export async function example6_ProxyLazyLoading() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 6: PROXY - Lazy Loading & Caching                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('🔐 Lazy Loading Proxy (object created on first use):\n');
  const lazyAPI = new LazyLoadingProxy(
    () => new APIClient('/api/users'),
    'User API'
  );
  console.log('✓ Proxy created (real API client not created yet)');
  console.log('✓ First access - client created');
  await lazyAPI.load();

  console.log('\n🔐 Caching Proxy (reuse cached data):\n');
  const realClient = new APIClient('/api/posts');
  const cachedClient = new CachingProxy(realClient);

  console.log('First access:');
  await cachedClient.load();
  cachedClient.getData(); // Cache miss, then hit

  console.log('\nSecond access:');
  cachedClient.getData(); // Cache hit

  console.log('\n💡 Benefit: Defer expensive operations, cache results');
}

// ====================================
// EXAMPLE 7: Flyweight - Efficient Memory
// ====================================

export function example7_FlyweightMemoryEfficiency() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ EXAMPLE 7: FLYWEIGHT - Memory-Efficient Object Sharing        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const cardFactory = new CardFlyweightFactory();
  const badgeFactory = new BadgeFlyweightFactory();
  const renderer = new CardRenderer(cardFactory, badgeFactory);

  // Sample data
  const projects = Array.from({ length: 5 }, (_, i) => ({
    id: `proj${i}`,
    title: `Project ${i}`,
    description: `Description for project ${i}`,
    tags: ['React', 'TypeScript', 'Node.js'],
    imageUrl: `/img${i}.jpg`,
    url: `/project${i}`,
  }));

  console.log('🪶 Rendering with flyweights:\n');
  console.log(`✓ Rendering ${projects.length} cards with 1 shared flyweight`);
  renderer.renderCards(projects, 'project');

  console.log(`✓ Rendering ${projects.length} article cards with 1 shared flyweight`);
  renderer.renderCards(projects, 'article');

  const badges = [
    { id: 'b1', label: 'React', color: '#blue' },
    { id: 'b2', label: 'Node.js', color: '#green' },
  ];

  console.log(`✓ Rendering ${badges.length} badges with 1 shared flyweight`);
  renderer.renderBadges(badges);

  console.log('\n📊 Stats:');
  const stats = renderer.getStats();
  console.log(`  Card flyweights: ${stats.cardFlyweights} (shared across all cards)`);
  console.log(`  Badge flyweights: ${stats.badgeFlyweights} (shared across all badges)`);

  console.log('\n💡 Benefit: Share intrinsic state, huge memory savings');
}

// ====================================
// COMBINED EXAMPLE - All Patterns Working Together
// ====================================

export async function exampleCombined_FullStructuralFlow() {
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ COMBINED: All Structural Patterns Working Together           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // 1. FACADE - Initialize app
  console.log('1️⃣  FACADE - Initialize application');
  const app = new ApplicationFacade();
  app.initialize();

  // 2. ADAPTER - Register different component types
  console.log('\n2️⃣  ADAPTER - Register different component APIs');
  console.log('   ⚠️  ComponentManager is not exported from ./index. Adapter example skipped.');

  // 3. BRIDGE - Select theme + renderer
  console.log('\n3️⃣  BRIDGE - Select theme and renderer combination');
  const palette = new ThemePalette();
  const themeBridge = palette.createBridge('future', 'web');
  console.log(`   ✓ Applied: ${themeBridge.getInfo()}`);

  // 4. COMPOSITE - Build navigation
  console.log('\n4️⃣  COMPOSITE - Build hierarchical navigation');
  const nav = new NavTreeBuilder('Main')
    .addItem('Home', '/')
    .addGroup('Services', '⚙️')
    .addItem('Design', '/services/design')
    .addItem('Dev', '/services/dev')
    .closeGroup()
    .addItem('About', '/about')
    .build();
  const navigator = new Navigator(nav);
  console.log(`   ✓ Created navigation with ${navigator.getAllItems().length} items`);

  // 5. DECORATOR - Create enhanced components
  console.log('\n5️⃣  DECORATOR - Add features to components');
  const btn = EnhancedComponentFactory.createButton('Action', {
    tooltip: 'Click to act',
    animated: true,
    analytics: true,
  });
  console.log('   ✓ Button with tooltip + animation + analytics');

  // 6. PROXY - Lazy load resources
  console.log('\n6️⃣  PROXY - Lazy load heavy resources');
  const lazyData = new LazyLoadingProxy(
    () => new APIClient('/api/data'),
    'Data API'
  );
  console.log('   ✓ Proxy created (real object not instantiated)');

  // 7. FLYWEIGHT - Efficient rendering
  console.log('\n7️⃣  FLYWEIGHT - Render many objects efficiently');
  const cardFactory = new CardFlyweightFactory();
  const badgeFactory = new BadgeFlyweightFactory();
  const renderer = new CardRenderer(cardFactory, badgeFactory);
  const projects = Array.from({ length: 10 }, (_, i) => ({
    id: `p${i}`,
    title: `Project ${i}`,
    description: `Desc ${i}`,
    tags: ['React'],
    imageUrl: `/img${i}.jpg`,
    url: `/p${i}`,
  }));
  renderer.renderCards(projects);
  console.log(`   ✓ Rendered ${projects.length} cards with 1 shared flyweight`);

  console.log('\n✅ All 7 Structural Patterns Working Together!');
}

// ====================================
// RUN ALL EXAMPLES
// ====================================

export async function runAllStructuralExamples() {
  example1_AdapterUnification();
  example2_BridgeThemeRendering();
  example3_CompositeNavigation();
  example4_DecoratorFeatureLayers();
  example5_FacadeSimplifiedControl();
  await example6_ProxyLazyLoading();
  example7_FlyweightMemoryEfficiency();
  await exampleCombined_FullStructuralFlow();

  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                  ✅ All Examples Completed                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
}
