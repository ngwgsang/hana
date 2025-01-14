import type {
  QueryResolvers,
  MutationResolvers,
  TeamRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

/**
 * Lấy tất cả Team và các Agent liên kết
 */
export const teams: QueryResolvers['teams'] = () => {
  return db.team.findMany({
    include: { agents: true },  // Bao gồm danh sách Agent
  })
}

/**
 * Lấy chi tiết Team theo ID
 */
export const team: QueryResolvers['team'] = ({ id }) => {
  return db.team.findUnique({
    where: { id },
    include: { agents: true },
  })
}

/**
 * Tạo Team mới
 */
export const createTeam: MutationResolvers['createTeam'] = ({ input }) => {
  return db.team.create({
    data: input,
  })
}

/**
 * Cập nhật thông tin Team
 */
export const updateTeam: MutationResolvers['updateTeam'] = ({ id, input }) => {
  return db.team.update({
    where: { id },
    data: input,
  })
}

/**
 * Xóa Team
 */
export const deleteTeam: MutationResolvers['deleteTeam'] = ({ id }) => {
  return db.team.delete({
    where: { id },
  })
}

/**
 * Liên kết Team với Agent
 */
export const Team: TeamRelationResolvers = {
  agents: (_obj, { root }) => {
    return db.team.findUnique({ where: { id: root.id } }).agents()
  },
}
