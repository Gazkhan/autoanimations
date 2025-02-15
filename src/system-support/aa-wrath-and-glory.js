import { trafficCop }       from "../router/traffic-cop.js"
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

export function systemHooks() {
    Hooks.on("createChatMessage", async (msg) => {
        if (msg.user.id !== game.user.id) { return };
        const systemName = 'wrath-and-glory';
        let success = msg.flags[systemName].itemData.result.isSuccess;
        if (success == true && msg.flags[systemName].itemData.result.damage.dice.length !== 0) { return };

        let compiledData = await getRequiredData({
            actorId: msg.speaker.actor ?? msg.flags[systemName].itemData.context.speaker.actor,
            targets: compileTargets(msg.flags[systemName].itemData.context.targets),
            itemUuid: msg.flags[systemName].itemData.testData.itemId,
            workflow: msg,
        })
        if (!compiledData.item) { return; }
        runWrathandGlory(compiledData)
    });
}

function compileTargets(targets) {
  if (!targets) { return []; }
  return Array.from(targets).map(token => canvas.tokens.get(token._id));
}

async function runWrathandGlory(input) {
    console.log(input);
    const handler = await AAHandler.make(input);
    trafficCop(handler);
}
