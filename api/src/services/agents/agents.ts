import type {
  QueryResolvers,
  MutationResolvers,
  AgentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

/**
 * Lấy tất cả các Agent
 */
export const agents: QueryResolvers['agents'] = () => {
  return db.agent.findMany({
    include: { team: true },  // Bao gồm thông tin Team liên kết
  })
}

/**
 * Lấy chi tiết một Agent theo ID
 */
export const agent: QueryResolvers['agent'] = ({ id }) => {
  return db.agent.findUnique({
    where: { id },
    include: { team: true },  // Bao gồm thông tin Team
  })
}

/**
 * Tạo Agent mới
 */
export const createAgent: MutationResolvers['createAgent'] = ({ input }) => {
  return db.agent.create({
    data: {
      avatar: input.avatar,
      name: input.name,
      settings: input.settings,
      team: {
        connect: { id: input.teamId },  // Kết nối với Team theo teamId
      },
    },
    include: { team: true },  // Trả về luôn thông tin Team
  })
}

/**
 * Cập nhật thông tin Agent
 */
export const updateAgent: MutationResolvers['updateAgent'] = ({ id, input }) => {
  return db.agent.update({
    where: { id },
    data: {
      avatar: input.avatar,
      name: input.name,
      settings: input.settings,
      team: input.teamId
        ? { connect: { id: input.teamId } }  // Cập nhật liên kết Team nếu có
        : undefined,
    },
    include: { team: true },
  })
}

/**
 * Xóa Agent
 */
export const deleteAgent: MutationResolvers['deleteAgent'] = ({ id }) => {
  return db.agent.delete({
    where: { id },
  })
}

/**
 * Liên kết Agent với Team (Resolver cho quan hệ)
 */
export const Agent: AgentRelationResolvers = {
  team: (_obj, { root }) => {
    return db.agent.findUnique({ where: { id: root.id } }).team()
  },
}
