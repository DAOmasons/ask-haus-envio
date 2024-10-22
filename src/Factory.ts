import { FastFactory } from 'generated';
import { addTransaction } from './utils/sync';

FastFactory.FactoryInitialized.handler(async ({ event, context }) => {
  context.Factory.set({
    id: `factory-${event.chainId}-${event.srcAddress}`,
    address: event.srcAddress,
    admins: [event.params.admin],
  });
});

FastFactory.AdminAdded.handler(async ({ event, context }) => {
  const factory = await context.Factory.get(
    `factory-${event.chainId}-${event.srcAddress}`
  );

  if (!factory) {
    context.log.error(`Factory ${event.srcAddress} not found`);
    return;
  }

  context.Factory.set({
    ...factory,
    admins: [...factory.admins, event.params.admin],
  });
});

FastFactory.AdminRemoved.handler(async ({ event, context }) => {
  const factory = await context.Factory.get(
    `factory-${event.chainId}-${event.srcAddress}`
  );

  if (!factory) {
    context.log.error(`Factory ${event.srcAddress} not found`);
    return;
  }

  context.Factory.set({
    ...factory,
    admins: factory.admins.filter((admin) => admin !== event.params.admin),
  });
});

FastFactory.ContestTemplateCreated.handler(async ({ event, context }) => {
  context.RoundTemplate.set({
    id: event.params.contestVersion,
    roundVersion: event.params.contestVersion,
    roundAddress: event.params.contestAddress,
    mdProtocol: event.params.contestInfo[0],
    mdPointer: event.params.contestInfo[1],
    active: true,
  });
});

FastFactory.ContestTemplateDeleted.handler(async ({ event, context }) => {
  const template = await context.RoundTemplate.get(event.params.contestVersion);

  if (!template) {
    context.log.error(
      `Contest template ${event.params.contestAddress} not found`
    );
    return;
  }

  context.RoundTemplate.set({
    ...template,
    active: false,
  });
});

FastFactory.ModuleTemplateCreated.handler(async ({ event, context }) => {
  context.ModuleTemplate.set({
    id: event.params.moduleName,
    moduleName: event.params.moduleName,
    templateAddress: event.params.moduleAddress,
    mdProtocol: event.params.moduleInfo[0],
    mdPointer: event.params.moduleInfo[1],
    active: true,
  });
});

FastFactory.ModuleTemplateDeleted.handler(async ({ event, context }) => {
  const template = await context.ModuleTemplate.get(event.params.moduleName);

  if (!template) {
    context.log.error(
      `Module template ${event.params.moduleAddress} not found`
    );
    return;
  }

  context.ModuleTemplate.set({
    ...template,
    active: false,
  });
});

FastFactory.ContestCloned.contractRegister(({ event, context }) => {
  context.addContest_v0_2_0(event.params.contestAddress);
});

FastFactory.ContestCloned.handler(async ({ event, context }) => {
  context.RoundClone.set({
    id: event.params.contestAddress,
    roundAddress: event.params.contestAddress,
    roundVersion: event.params.contestVersion,
    filterTag: event.params.filterTag,
    template_id: event.params.contestVersion,
  });
});

FastFactory.ModuleCloned.handler(async ({ event, context }) => {
  context.ModuleClone.set({
    id: event.params.moduleAddress,
    moduleAddress: event.params.moduleAddress,
    roundAddress: undefined,
    contest_id: undefined,
    moduleName: event.params.moduleName,
    filterTag: event.params.filterTag,
    moduleTemplate_id: event.params.moduleName,
  });
});

FastFactory.ContestBuilt.handler(async ({ event, context }) => {
  // const entity: FastFactory_ContestBuilt = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   votesModule: event.params.votesModule,
  //   pointsModule: event.params.pointsModule,
  //   choicesModule: event.params.choicesModule,
  //   executionModule: event.params.executionModule,
  //   contestAddress: event.params.contestAddress,
  //   contestVersion: event.params.contestVersion,
  //   filterTag: event.params.filterTag,
  // };
  // context.FastFactory_ContestBuilt.set(entity);
});
