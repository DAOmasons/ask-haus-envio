import { PrePop_v0_2_0 } from 'generated';
import { basicChoiceSchema } from './utils/schemas';

PrePop_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_PrePop_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
  });
});

PrePop_v0_2_0.Registered.handler(async ({ event, context }) => {
  const params = await context.Params_PrePop_v0_2_0.get(event.srcAddress);

  if (!params) {
    context.log.error(`Params ${event.srcAddress} not found`);
    return;
  }

  const {
    choiceData: [[protocol, pointer], bytes, isActive, registrar],
  } = event.params;

  if (protocol === 6969420n) {
    const validated = basicChoiceSchema.safeParse(JSON.parse(pointer));
    if (validated.success) {
      const { title, color, description, link } = validated.data;

      context.BasicChoice.set({
        id: `choice-${event.params.choiceId}`,
        choiceId: event.params.choiceId,
        title,
        color,
        description,
        link,
        bytes,
        registrar,
        moduleParams_id: event.srcAddress,
        isValid: true,
        isActive: isActive,
        amountVoted: 0n,
      });
    } else {
      context.log.error(
        `Invalid pointer ${pointer} for choice ${event.params.choiceId}`
      );
      console.log(validated.error.message);
      context.BasicChoice.set({
        id: `choice-${event.params.choiceId}-${event.srcAddress}`,
        title: '',
        color: '',
        description: undefined,
        link: undefined,
        choiceId: event.params.choiceId,
        bytes,
        registrar,
        moduleParams_id: event.srcAddress,
        isValid: false,
        isActive: isActive,
        amountVoted: 0n,
      });
    }
  }

  //   const metadata = context.BasicChoice.set({
  //     id: `choice-${event.params.choiceId}-${event.srcAddress}`,
  //     choiceId: event.params.choiceId,

  //   });
});
