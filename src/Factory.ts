import { FastFactory } from 'generated';
import { addTransaction } from './utils/sync';
import {
  IndexerKey,
  isAskHausPoll,
  isImpl,
  Module,
} from './utils/dynamicIndexing';
import { basicChoiceSchema, pollMetadataSchema } from './utils/schemas';

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
  const shouldIndex = isImpl(event.params.filterTag);
  if (!shouldIndex) return;
  context.addContest_v0_2_0(event.params.contestAddress);
});

FastFactory.ContestCloned.handler(async ({ event, context }) => {
  const shouldIndex = isImpl(event.params.filterTag);
  if (!shouldIndex) return;
  context.RoundClone.set({
    id: event.params.contestAddress,
    roundAddress: event.params.contestAddress,
    roundVersion: event.params.contestVersion,
    filterTag: event.params.filterTag,
    template_id: event.params.contestVersion,
  });
});

FastFactory.ModuleCloned.contractRegister(({ event, context }) => {
  const shouldIndex = isImpl(event.params.filterTag);
  if (!shouldIndex) return;

  if (event.params.moduleName === Module.BaalGate_v0_2_0) {
    context.addBaalGate_v0_2_0(event.params.moduleAddress);
  } else if (event.params.moduleName === Module.BaalPoints_v0_2_0) {
    context.addBaalPoints_v0_2_0(event.params.moduleAddress);
  } else if (event.params.moduleName === Module.TimedVotes_v0_2_0) {
    context.addTimedVotes_v0_2_0(event.params.moduleAddress);
  } else if (event.params.moduleName === Module.PrePop_v0_2_0) {
    context.addPrePop_v0_2_0(event.params.moduleAddress);
  }
});

FastFactory.ModuleCloned.handler(async ({ event, context }) => {
  const shouldIndex = isImpl(event.params.filterTag);
  if (!shouldIndex) return;

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
  const shouldIndex = isImpl(event.params.filterTag);

  if (!shouldIndex) return;

  const contest = await context.Round.get(event.params.contestAddress);

  if (!contest) {
    context.log.error(`Contest ${event.params.contestAddress} not found`);
    return;
  }

  // const votesModule = await context.ModuleClone.get(event.params.votesModule);
  // const pointsModule = await context.ModuleClone.get(event.params.pointsModule);
  // const choicesModule = await context.ModuleClone.get(
  //   event.params.choicesModule
  // );
  // const contest = await context.RoundClone.get(event.params.contestAddress);

  // if (!votesModule || !pointsModule || !choicesModule) {
  //   context.log.error(
  //     `Module not found: ${event.params.votesModule} ${event.params.pointsModule} ${event.params.choicesModule}`
  //   );
  //   return;
  // }

  if (
    isAskHausPoll({
      filterTag: event.params.filterTag,
      votesModuleName: event.params.votesModule,
      pointsModuleName: event.params.pointsModule,
      choicesModuleName: event.params.choicesModule,
      contestVersion: event.params.contestVersion,
    })
  ) {
    const protocol = contest.mdProtocol;
    const pointer = contest.mdPointer;

    if (protocol === 6969420n) {
      const validated = pollMetadataSchema.safeParse(JSON.parse(pointer));
      if (validated.success) {
        const { title, description, pollLink, answerType, requestComment } =
          validated.data;

        context.AskHausPoll.set({
          id: event.params.contestAddress,
          round_id: event.params.contestAddress,
          votesParams_id: contest.votesModule_id,
          pointsParams_id: contest.pointsModule_id,
          choicesParams_id: contest.choicesModule_id,
          title: title,
          description: description,
          pollLink: pollLink,
          answerType: answerType,
          requestComment: requestComment,
        });
      }
    }
  }

  addTransaction(event, context);
});
