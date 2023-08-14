import { Module } from "@nestjs/common";

import { ElectronService } from "@electron/electron.service";

@Module({
    providers: [ElectronService],
})
export class ElectronModule {}
