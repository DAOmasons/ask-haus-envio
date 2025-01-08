import { BaalGate_v0_2_0 } from 'generated';
import { detailedChoiceSchema } from './utils/schemas';
import { addTransaction } from './utils/sync';

BaalGate_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_BaalGate_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    dao: event.params.daoAddress,
    lootToken: event.params.lootToken,
    sharesToken: event.params.sharesToken,
    holderType: event.params.holderType,
    holderThreshold: event.params.holderThreshold,
    checkpoint: event.params.checkpoint,
    timed: event.params.timed,
    startTime: event.params.startTime,
    endTime: event.params.endTime,
  });
});

BaalGate_v0_2_0.Registered.handler(async ({ event, context }) => {
  const metadata = event.params.choiceData[0];
  const protocol = metadata[0];
  const pointer = metadata[1];
  const choiceBytesData = event.params.choiceData[1];
  const registrar = event.params.choiceData[3];

  if (protocol === 6969420n) {
    const validated = detailedChoiceSchema.safeParse(JSON.parse(pointer));

    //

    if (validated.success) {
      const { title, color, description, link } = validated.data;

      context.BasicChoice.set({
        id: `choice-${event.params.choiceId}`,
        choiceId: event.params.choiceId,
        title: title,
        color: color,
        description: JSON.stringify(description),
        link: link,
        bytes: choiceBytesData,
        registrar: registrar,
        basicChoices_id: event.srcAddress,
        isValid: true,
        isActive: true,
        amountVoted: 0n,
        postedBy: event.transaction.from || '0xBr0k3n@ddr3ss',
        postedAt: event.block.timestamp,
      });

      addTransaction(event, context);
    } else {
      context.log.error(
        `Failed to parse choice metadata for choice ${event.params.choiceId}:
        
        protocol: ${protocol}
        pointer: ${pointer}

        `
      );
    }
  } else {
    context.log.warn(`Protocol ${protocol} not supported`);
  }
});
