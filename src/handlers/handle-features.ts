import { WAChat } from '@utils/chat';
import { IFeature } from '@utils/interfaces';
import fs from 'fs/promises';

export async function handleFeatures(chat: WAChat): Promise<Map<string, IFeature>> {
    const files = await fs.readdir(`./dist/features`).then((cb) => cb.filter((file) => file.endsWith('.js')));

    const imports = files.map((file) => import(`../features/${file}`));
    const featrueModules = await Promise.all(imports);

    const features = featrueModules.map(({ default: feature }): IFeature => new feature(chat));

    const featureMap = new Map<string, IFeature>();
    features.forEach((feature) => {
        featureMap.set(feature.name, feature);
    });

    return featureMap;
}
