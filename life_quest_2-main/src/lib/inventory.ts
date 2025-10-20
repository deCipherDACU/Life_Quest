
import type { Item } from './types';
import { 
    Sword, Shield, Crown, Anchor, Aperture, Gem, Sparkles, Sun, Moon, Wind, Mountain, 
    Droplets, Flame, Star, Zap, Coins, Briefcase, Box, GitMerge, Trophy, Gamepad2, 
    Heart, Repeat, FileText, Palette, Bot, Timer, Notebook, Brain, Diamond, BookOpen, Eye 
} from 'lucide-react';

export const defaultWeapon: Item = {
    id: 'weapon-0',
    name: 'Fists',
    type: 'Weapon',
    bonus: '+0 to Quest Rewards',
    icon: Sword,
    rarity: 'Common',
}

export const defaultArmor: Item = {
    id: 'armor-0',
    name: 'Basic Clothes',
    type: 'Armor',
    bonus: '+0 to Health',
    icon: Shield,
    rarity: 'Common',
}

export const defaultHelmet: Item = {
    id: 'helmet-0',
    name: 'Bare Head',
    type: 'Helmet',
    bonus: '+0 to Focus',
    icon: Crown,
    rarity: 'Common',
}

export const defaultShield: Item = {
    id: 'shield-0',
    name: 'No Shield',
    type: 'Shield',
    bonus: '+0 to Defense',
    icon: Anchor,
    rarity: 'Common',
}

export const availableCollectibles: Item[] = [
    // Weapons
    { id: 'weapon-1', name: 'Dagger of Diligence', type: 'Weapon', bonus: '+5% XP from quests', icon: Sword, rarity: 'Common' },
    { id: 'weapon-2', name: 'Mace of Moneybags', type: 'Weapon', bonus: '+5% Coins from quests', icon: Sword, rarity: 'Rare' },
    { id: 'weapon-3', name: 'Blade of the Scholar', type: 'Weapon', bonus: '+15% XP from Education tasks', icon: Sword, rarity: 'Epic' },
    { id: 'weapon-4', name: 'Hammer of the Hustler', type: 'Weapon', bonus: '+15% Coins from Career tasks', icon: Sword, rarity: 'Epic' },
    { id: 'weapon-5', name: 'Glimmering Greataxe', type: 'Weapon', bonus: '+5% Gems from Boss Fights', icon: Sword, rarity: 'Legendary' },

    // Armor
    { id: 'armor-1', name: 'Armor of Resilience', type: 'Armor', bonus: '+10 Max Health', icon: Shield, rarity: 'Common' },
    { id: 'armor-2', name: 'Aegis of Alacrity', type: 'Armor', bonus: '10% chance to ignore task damage', icon: Shield, rarity: 'Rare' },
    { id: 'armor-3', name: 'Plate of Prosperity', type: 'Armor', bonus: 'Doubles daily login coin bonus', icon: Shield, rarity: 'Epic' },
    { id: 'armor-4', name: 'Bulwark of the Stalwart', type: 'Armor', bonus: 'Streak freeze on one missed day per week', icon: Shield, rarity: 'Legendary' },

    // Helmets
    { id: 'helmet-1', name: 'Helm of Focus', type: 'Helmet', bonus: '+10% Focus time in Pomodoro', icon: Crown, rarity: 'Common' },
    { id: 'helmet-2', name: 'Circlet of Clarity', type: 'Helmet', bonus: 'AI Coach responses are more detailed', icon: Crown, rarity: 'Rare' },
    { id: 'helmet-3', name: 'Crown of Command', type: 'Helmet', bonus: 'Grants an extra daily quest re-roll', icon: Crown, rarity: 'Epic' },
    { id: 'helmet-4', name: 'Diadem of the Dungeon Master', type: 'Helmet', bonus: 'Special Quests have one extra challenge choice', icon: Crown, rarity: 'Legendary' },

    // Shields
    { id: 'shield-1', name: 'Buckler of Bravery', type: 'Shield', bonus: '+5% damage to weekly boss', icon: Anchor, rarity: 'Common' },
    { id: 'shield-2', name: 'Targe of Triumph', type: 'Shield', bonus: '-10% damage from weekly boss', icon: Anchor, rarity: 'Rare' },
    { id: 'shield-3', name: 'Spelunker\'s Guard', type: 'Shield', bonus: 'Special Quest rewards are 10% higher', icon: Anchor, rarity: 'Epic' },
    { id: 'shield-4', name: 'Aegis of the Achiever', type: 'Shield', bonus: 'Unlocks one extra achievement requirement hint', icon: Anchor, rarity: 'Legendary' },
    
    // -- 100 Collectibles --

    // Common Collectibles (25)
    { id: 'collect-c1', name: 'Polished Stone', type: 'Collectible', bonus: 'A simple, smooth stone. A symbol of patience.', icon: Gem, rarity: 'Common' },
    { id: 'collect-c2', name: 'Four-Leaf Clover', type: 'Collectible', bonus: 'A lucky charm for your journey.', icon: Sparkles, rarity: 'Common' },
    { id: 'collect-c3', name: 'Small Feather', type: 'Collectible', bonus: 'Light and delicate, a reminder to tread lightly.', icon: Wind, rarity: 'Common' },
    { id: 'collect-c4', name: 'Old Coin', type: 'Collectible', bonus: 'A relic from a forgotten time.', icon: Coins, rarity: 'Common' },
    { id: 'collect-c5', name: 'Aged Map Fragment', type: 'Collectible', bonus: 'A piece of a larger puzzle.', icon: FileText, rarity: 'Common' },
    { id: 'collect-c6', name: 'Common Wildflower', type: 'Collectible', bonus: 'A splash of color from the fields.', icon: Sun, rarity: 'Common' },
    { id: 'collect-c7', name: 'Sturdy Twig', type: 'Collectible', bonus: 'A reliable piece of wood.', icon: Mountain, rarity: 'Common' },
    { id: 'collect-c8', name: 'Smooth Seashell', type: 'Collectible', bonus: 'Whispers of the ocean.', icon: Droplets, rarity: 'Common' },
    { id: 'collect-c9', name: 'Singed Scroll', type: 'Collectible', bonus: 'A scroll that has seen adventure.', icon: Flame, rarity: 'Common' },
    { id: 'collect-c10', name: 'Faded Ribbon', type: 'Collectible', bonus: 'Once part of a grand prize.', icon: Star, rarity: 'Common' },
    { id: 'collect-c11', name: 'Simple Wooden Ring', type: 'Collectible', bonus: 'Crafted with care.', icon: Gem, rarity: 'Common' },
    { id: 'collect-c12', name: 'Cracked Acorn', type: 'Collectible', bonus: 'A promise of a great tree.', icon: Mountain, rarity: 'Common' },
    { id: 'collect-c13', name: 'Bird\'s Nest', type: 'Collectible', bonus: 'A marvel of natural engineering.', icon: Wind, rarity: 'Common' },
    { id: 'collect-c14', name: 'Bottle of Rainwater', type: 'Collectible', bonus: 'Pure and refreshing.', icon: Droplets, rarity: 'Common' },
    { id: 'collect-c15', name: 'Dried Herbs', type: 'Collectible', bonus: 'A fragrant bundle with potential.', icon: Sun, rarity: 'Common' },
    { id: 'collect-c16', name: 'Lump of Charcoal', type: 'Collectible', bonus: 'For writing or for burning.', icon: Flame, rarity: 'Common' },
    { id: 'collect-c17', name: 'Tarnished Button', type: 'Collectible', bonus: 'Lost from a hero\'s coat.', icon: Shield, rarity: 'Common' },
    { id: 'collect-c18', name: 'Rusted Key', type: 'Collectible', bonus: 'What lock does it open?', icon: Zap, rarity: 'Common' },
    { id: 'collect-c19', name: 'Worn Leather Strap', type: 'Collectible', bonus: 'Part of a well-used tool.', icon: Briefcase, rarity: 'Common' },
    { id: 'collect-c20', name: 'Shard of Pottery', type: 'Collectible', bonus: 'A fragment of history.', icon: Box, rarity: 'Common' },
    { id: 'collect-c21', name: 'Piece of Flint', type: 'Collectible', bonus: 'Ready to spark an idea.', icon: Sparkles, rarity: 'Common' },
    { id: 'collect-c22', name: 'Ball of Twine', type: 'Collectible', bonus: 'For binding things together.', icon: GitMerge, rarity: 'Common' },
    { id: 'collect-c23', name: 'Moth-eaten Pennant', type: 'Collectible', bonus: 'A symbol of a forgotten team.', icon: Trophy, rarity: 'Common' },
    { id: 'collect-c24', name: 'Single Die', type: 'Collectible', bonus: 'A chance to change your fate.', icon: Gamepad2, rarity: 'Common' },
    { id: 'collect-c25', name: 'Locket Clasp', type: 'Collectible', bonus: 'The heart of it is missing.', icon: Heart, rarity: 'Common' },

    // Rare Collectibles (25)
    { id: 'collect-r1', name: 'Geode Slice', type: 'Collectible', bonus: 'Hidden beauty within.', icon: Gem, rarity: 'Rare' },
    { id: 'collect-r2', name: 'Phoenix Down', type: 'Collectible', bonus: 'A single, warm feather.', icon: Flame, rarity: 'Rare' },
    { id: 'collect-r3', name: 'Elf-stone', type: 'Collectible', bonus: 'Glows with a faint inner light.', icon: Sparkles, rarity: 'Rare' },
    { id: 'collect-r4', name: 'Dragon Scale', type: 'Collectible', bonus: 'Harder than steel.', icon: Shield, rarity: 'Rare' },
    { id: 'collect-r5', name: 'Star Metal Shard', type: 'Collectible', bonus: 'Fell from the heavens.', icon: Star, rarity: 'Rare' },
    { id: 'collect-r6', name: 'Vial of Starlight', type: 'Collectible', bonus: 'Liquid illumination.', icon: Moon, rarity: 'Rare' },
    { id: 'collect-r7', name: 'Petrified Egg', type: 'Collectible', bonus: 'What creature was inside?', icon: Mountain, rarity: 'Rare' },
    { id: 'collect-r8', name: 'Whispering Shell', type: 'Collectible', bonus: 'It murmurs ancient secrets.', icon: Droplets, rarity: 'Rare' },
    { id: 'collect-r9', name: 'Gale in a Bottle', type: 'Collectible', bonus: 'A captured storm.', icon: Wind, rarity: 'Rare' },
    { id: 'collect-r10', name: 'Sunstone Fragment', type: 'Collectible', bonus: 'Warm to the touch.', icon: Sun, rarity: 'Rare' },
    { id: 'collect-r11', name: 'Adamantine Splinter', type: 'Collectible', bonus: 'Unbreakable and sharp.', icon: Sword, rarity: 'Rare' },
    { id: 'collect-r12', name: 'Frozen Teardrop', type: 'Collectible', bonus: 'A moment of sorrow, preserved.', icon: Droplets, rarity: 'Rare' },
    { id: 'collect-r13', name: 'Obsidian Arrowhead', type: 'Collectible', bonus: 'Volcanic glass, perfectly sharp.', icon: Aperture, rarity: 'Rare' },
    { id: 'collect-r14', name: 'Warlock\'s Pocketwatch', type: 'Collectible', bonus: 'The hands spin backwards.', icon: Timer, rarity: 'Rare' },
    { id: 'collect-r15', name: 'Rune of Focus', type: 'Collectible', bonus: 'Carved with symbols of concentration.', icon: Brain, rarity: 'Rare' },
    { id: 'collect-r16', name: 'Dwarven Beard Clasp', type: 'Collectible', bonus: 'A symbol of honor and craft.', icon: Anchor, rarity: 'Rare' },
    { id: 'collect-r17', name: 'Memento of a Lost Love', type: 'Collectible', bonus: 'A pressed flower in glass.', icon: Heart, rarity: 'Rare' },
    { id: 'collect-r18', name: 'Miniature Golem Core', type: 'Collectible', bonus: 'It hums with a low energy.', icon: Zap, rarity: 'Rare' },
    { id: 'collect-r19', name: 'Alchemist\'s Ouroboros', type: 'Collectible', bonus: 'A snake eating its own tail.', icon: Repeat, rarity: 'Rare' },
    { id: 'collect-r20', name: 'Crystalized Mana', type: 'Collectible', bonus: 'Raw magical energy.', icon: Diamond, rarity: 'Rare' },
    { id: 'collect-r21', name: 'Page from the Silver Codex', type: 'Collectible', bonus: 'Written in a shimmering, unknown language.', icon: FileText, rarity: 'Rare' },
    { id: 'collect-r22', name: 'Griffin\'s Talon', type: 'Collectible', bonus: 'A trophy from a majestic beast.', icon: Trophy, rarity: 'Rare' },
    { id: 'collect-r23', name: 'Seed of the World Tree', type: 'Collectible', bonus: 'Vibrates with life.', icon: Sun, rarity: 'Rare' },
    { id: 'collect-r24', name: 'Troll\'s Tooth', type: 'Collectible', bonus: 'A rugged and intimidating molar.', icon: Mountain, rarity: 'Rare' },
    { id: 'collect-r25', name: 'Mermaid\'s Scale', type: 'Collectible', bonus: 'Shimmers with all the colors of the sea.', icon: Droplets, rarity: 'Rare' },

    // Epic Collectibles (25)
    { id: 'collect-e1', name: 'Heart of the Mountain', type: 'Collectible', bonus: 'A crystal that beats like a heart.', icon: Gem, rarity: 'Epic' },
    { id: 'collect-e2', name: 'Eye of the Storm', type: 'Collectible', bonus: 'A perfectly calm orb of swirling energy.', icon: Wind, rarity: 'Epic' },
    { id: 'collect-e3', name: 'Philosopher\'s Stone Fragment', type: 'Collectible', bonus: 'Turns lead pencils into gold leaf pens.', icon: Sparkles, rarity: 'Epic' },
    { id: 'collect-e4', name: 'Shadowflame Ember', type: 'Collectible', bonus: 'A flame that casts no light, only shadow.', icon: Moon, rarity: 'Epic' },
    { id: 'collect-e5', name: 'Tear of a Sun God', type: 'Collectible', bonus: 'A drop of pure, solidified sunlight.', icon: Sun, rarity: 'Epic' },
    { id: 'collect-e6', name: 'Miniature Constellation', type: 'Collectible', bonus: 'Stars swirling in a small glass sphere.', icon: Star, rarity: 'Epic' },
    { id: 'collect-e7', name: 'Unmelting Snowflake', type: 'Collectible', bonus: 'Perfectly preserved winter\'s art.', icon: Droplets, rarity: 'Epic' },
    { id: 'collect-e8', name: 'Breath of the World Serpent', type: 'Collectible', bonus: 'A vial containing a wisp of ancient air.', icon: Wind, rarity: 'Epic' },
    { id: 'collect-e9', name: 'Forge-Heart of a Fire Giant', type: 'Collectible', bonus: 'Still radiates an immense heat.', icon: Flame, rarity: 'Epic' },
    { id: 'collect-e10', name: 'Golden Apple of Discord', type: 'Collectible', bonus: 'Tempting, isn\'t it?', icon: Sun, rarity: 'Epic' },
    { id: 'collect-e11', name: 'Shard of the Celestial Armor', type: 'Collectible', bonus: 'Gleams with heavenly light.', icon: Shield, rarity: 'Epic' },
    { id: 'collect-e12', name: 'The First King\'s Crown', type: 'Collectible', bonus: 'Heavy with the weight of history.', icon: Crown, rarity: 'Epic' },
    { id: 'collect-e13', name: 'Timeless Hourglass', type: 'Collectible', bonus: 'The sand flows both ways.', icon: Timer, rarity: 'Epic' },
    { id: 'collect-e14', name: 'Fools\' Gold Bar', type: 'Collectible', bonus: 'Heavier and shinier than real gold.', icon: Coins, rarity: 'Epic' },
    { id: 'collect-e15', name: 'Map to a Sunken City', type: 'Collectible', bonus: 'The ink shifts and changes.', icon: FileText, rarity: 'Epic' },
    { id: 'collect-e16', name: 'Kraken\'s Inkwell', type: 'Collectible', bonus: 'The ink writes words of its own accord.', icon: Anchor, rarity: 'Epic' },
    { id: 'collect-e17', name: 'A single, perfect musical note', type: 'Collectible', bonus: 'Held in a crystal, it resonates with your soul.', icon: Brain, rarity: 'Epic' },
    { id: 'collect-e18', name: 'The Jester\'s Last Laugh', type: 'Collectible', bonus: 'A petrified smile that is both amusing and unsettling.', icon: Bot, rarity: 'Epic' },
    { id: 'collect-e19', name: 'Void-Touched Orchid', type: 'Collectible', bonus: 'A flower that absorbs all light around it.', icon: Aperture, rarity: 'Epic' },
    { id: 'collect-e20', name: 'Fragment of a Hero\'s Will', type: 'Collectible', bonus: 'A small, glowing stone that inspires courage.', icon: Zap, rarity: 'Epic' },
    { id: 'collect-e21', name: 'Basilisk\'s Gaze', type: 'Collectible', bonus: 'A polished obsidian mirror said to hold a petrifying gaze.', icon: Moon, rarity: 'Epic' },
    { id: 'collect-e22', name: 'Harpy\'s Songbird', type: 'Collectible', bonus: 'A small, mechanical bird that sings an enchanting, yet sorrowful tune.', icon: Wind, rarity: 'Epic' },
    { id: 'collect-e23', name: 'Manticore\'s Stinger', type: 'Collectible', bonus: 'Still sharp and contains a drop of potent venom.', icon: Sword, rarity: 'Epic' },
    { id: 'collect-e24', name: 'Siren\'s Comb', type: 'Collectible', bonus: 'Made of coral and pearls, it calls to the sea.', icon: Droplets, rarity: 'Epic' },
    { id: 'collect-e25', name: 'Minotaur\'s Horn', type: 'Collectible', bonus: 'A powerful symbol of navigating life\'s labyrinths.', icon: Mountain, rarity: 'Epic' },

    // Legendary Collectibles (25)
    { id: 'collect-l1', name: 'The Unwritten Book', type: 'Collectible', bonus: 'Its pages are blank, waiting for your story.', icon: BookOpen, rarity: 'Legendary' },
    { id: 'collect-l2', name: 'Heart of a Dying Star', type: 'Collectible', bonus: 'A pulsating gem of unimaginable power.', icon: Star, rarity: 'Legendary' },
    { id: 'collect-l3', name: 'The Last Echo', type: 'Collectible', bonus: 'A sound that can only be heard once.', icon: Wind, rarity: 'Legendary' },
    { id: 'collect-l4', name: 'A Moment of True Silence', type: 'Collectible', bonus: 'Captured in a sound-proof jar.', icon: Box, rarity: 'Legendary' },
    { id: 'collect-l5', name: 'Seed of What Could Be', type: 'Collectible', bonus: 'A seed that grows into a plant of pure potential.', icon: Sparkles, rarity: 'Legendary' },
    { id: 'collect-l6', name: 'The Fulcrum of Balance', type: 'Collectible', bonus: 'A perfectly balanced scale that weighs thoughts.', icon: Anchor, rarity: 'Legendary' },
    { id: 'collect-l7', name: 'Chronos\' Pocket Watch', type: 'Collectible', bonus: 'It doesn\'t tell time. It controls it.', icon: Timer, rarity: 'Legendary' },
    { id: 'collect-l8', name: 'The Cosmic Egg', type: 'Collectible', bonus: 'The beginning of a new universe in your pocket.', icon: Aperture, rarity: 'Legendary' },
    { id: 'collect-l9', name: 'A God\'s Tear', type: 'Collectible', bonus: 'Contains an emotion too powerful to name.', icon: Droplets, rarity: 'Legendary' },
    { id: 'collect-l10', name: 'The Architect\'s Blueprint', type: 'Collectible', bonus: 'The plan for reality itself.', icon: FileText, rarity: 'Legendary' },
    { id: 'collect-l11', name: 'Quill of the Storyteller', type: 'Collectible', bonus: 'It writes stories into existence.', icon: Palette, rarity: 'Legendary' },
    { id: 'collect-l12', name: 'The Final Key', type: 'Collectible', bonus: 'It is said to unlock any door, physical or metaphorical.', icon: Zap, rarity: 'Legendary' },
    { id: 'collect-l13', name: 'A Shard of the First Flame', type: 'Collectible', bonus: 'The origin of all light and ambition.', icon: Flame, rarity: 'Legendary' },
    { id: 'collect-l14', name: 'The Silent Oracle', type: 'Collectible', bonus: 'A skull that shows you visions of the future, but never speaks.', icon: Bot, rarity: 'Legendary' },
    { id: 'collect-l15', name: 'Crown of the Endless King', type: 'Collectible', bonus: 'Whoever wears it is a ruler of their own reality.', icon: Crown, rarity: 'Legendary' },
    { id: 'collect-l16', name: 'The Unbreakable Vow', type: 'Collectible', bonus: 'A magical contract that glows with golden light.', icon: Notebook, rarity: 'Legendary' },
    { id: 'collect-l17', name: 'The Lost Chord', type: 'Collectible', bonus: 'A musical harmony that can reshape the world.', icon: Brain, rarity: 'Legendary' },
    { id: 'collect-l18', name: 'The World in a Bottle', type: 'Collectible', bonus: 'A tiny, living ecosystem in a sealed jar.', icon: Droplets, rarity: 'Legendary' },
    { id: 'collect-l19', name: 'The Compass That Points to Your Heart\'s Desire', type: 'Collectible', bonus: 'It doesn\'t point North.', icon: Heart, rarity: 'Legendary' },
    { id: 'collect-l20', name: 'The Leviathan\'s Tooth', type: 'Collectible', bonus: 'A massive tooth from a beast that sleeps in the deep.', icon: Anchor, rarity: 'Legendary' },
    { id: 'collect-l21', name: 'The Phoenix\'s Rebirth', type: 'Collectible', bonus: 'A small pile of ash that regrows into a tiny bird each day.', icon: Flame, rarity: 'Legendary' },
    { id: 'collect-l22', name: 'The All-Seeing Eye', type: 'Collectible', bonus: 'An orb that shows you the truth in all things.', icon: Eye, rarity: 'Legendary' },
    { id: 'collect-l23', name: 'The Fountain of Youth\'s Water', type: 'Collectible', bonus: 'A single drop that reverses one day of aging.', icon: Droplets, rarity: 'Legendary' },
    { id: 'collect-l24', name: 'The Infinite Library Card', type: 'Collectible', bonus: 'Access to any book ever written, or that ever will be.', icon: BookOpen, rarity: 'Legendary' },
    { id: 'collect-l25', name: 'The Gauntlet of Destiny', type: 'Collectible', bonus: 'A powerful glove that allows you to shape your own fate.', icon: Zap, rarity: 'Legendary' },
];

    