import path from 'path';
import Module from 'module';

process.env.NODE_PATH = process.cwd();

(Module as any)._initPaths();
