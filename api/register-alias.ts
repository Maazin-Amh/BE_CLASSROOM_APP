import path from 'path';
import Module from 'module';

process.env.NODE_PATH = path.join(process.cwd(), 'src');

(Module as any)._initPaths();
