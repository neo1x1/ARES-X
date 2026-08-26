import { useWorkflowStore } from './state/workflowStore';
import { useRegistryStore } from './state/registryStore';
import { initializeNodeRegistry } from './registry/nodeRegistry';
import { executor, validator } from './engine';

function useWorkflow() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const addExecutionLog = useWorkflowStore((state) => state.addExecutionLog);
  const setExecutionState = useWorkflowStore((state) => state.setExecutionState);
  const setValidationErrors = useWorkflowStore((state) => state.setValidationErrors);
  const setValidationWarnings = useWorkflowStore((state) => state.setValidationWarnings);

  const validateWorkflow = () => {
    const result = validator.validate(nodes, edges);
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
    return result;
  };

  const executeWorkflow = async () => {
    const validation = validateWorkflow();
    if (!validation.isValid) {
      setExecutionState('FAILED');
      return validation;
    }

    setExecutionState('RUNNING');
    const result = await executor.execute(nodes, edges);

    // Add logs to store
    result.logs?.forEach((log) => {
      addExecutionLog({
        nodeId: log.nodeId,
        message: log.message,
        type: log.type,
      });
    });

    if (result.success) {
      setExecutionState('SUCCESS');
    } else {
      setExecutionState('FAILED');
    }

    return result;
  };

  return {
    validateWorkflow,
    executeWorkflow,
  };
}

export { useWorkflow, initializeNodeRegistry };
