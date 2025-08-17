import { Request, Response } from 'express';
import UserModel from '../models/user.model';

// Get team members by invite code (referral code)
export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const { inviteCode } = req.params;

        if (!inviteCode) {
            return res.status(400).json({
                success: false,
                message: 'Invite code is required.'
            });
        }

        // Find the team leader (user whose referralCode matches the inviteCode)
        const teamLeader = await UserModel.findOne({ referralCode: inviteCode })
            .select('name uid phoneNumber email plan referralCode totalBalance totalInvites level createdAt');

        if (!teamLeader) {
            return res.status(404).json({
                success: false,
                message: 'Team leader not found with this invite code.'
            });
        }

        // Find all team members (users whose inviteCode matches the referralCode)
        const teamMembers = await UserModel.find({ inviteCode: inviteCode })
            .select('name uid phoneNumber email plan totalBalance totalWithdrawals totalInvites level createdAt')
            .sort({ createdAt: -1 });

        // Calculate team statistics
        const teamStats = {
            totalMembers: teamMembers.length,
            activeMembers: teamMembers.filter(member => member.level > 0).length,
            totalTeamBalance: teamMembers.reduce((sum, member) => sum + member.totalBalance, 0),
            totalTeamWithdrawals: teamMembers.reduce((sum, member) => sum + member.totalWithdrawals, 0),
            averageLevel: teamMembers.length > 0
                ? (teamMembers.reduce((sum, member) => sum + member.level, 0) / teamMembers.length).toFixed(2)
                : 0
        };

        res.status(200).json({
            success: true,
            message: 'Team members retrieved successfully',
            data: {
                teamLeader: {
                    name: teamLeader.name,
                    uid: teamLeader.uid,
                    phoneNumber: teamLeader.phoneNumber,
                    email: teamLeader.email,
                    plan: teamLeader.plan,
                    referralCode: teamLeader.referralCode,
                    totalBalance: teamLeader.totalBalance,
                    totalInvites: teamLeader.totalInvites,
                    level: teamLeader.level,
                    joinedAt: teamLeader.createdAt
                },
                teamMembers,
                teamStats
            }
        });

    } catch (error: any) {
        console.error('Error fetching team members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team members',
            error: error.message
        });
    }
};

// Get team member details by UID and invite code
export const getTeamMemberDetails = async (req: Request, res: Response) => {
    try {
        const { inviteCode, uid } = req.params;

        if (!inviteCode || !uid) {
            return res.status(400).json({
                success: false,
                message: 'Both invite code and UID are required.'
            });
        }

        // Find the specific team member
        const teamMember = await UserModel.findOne({
            uid: uid,
            inviteCode: inviteCode
        }).select('name uid phoneNumber email plan totalBalance totalWithdrawals totalInvites level createdAt');

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found or not part of this team.'
            });
        }

        // Find the team leader
        const teamLeader = await UserModel.findOne({ referralCode: inviteCode })
            .select('name uid referralCode');

        res.status(200).json({
            success: true,
            message: 'Team member details retrieved successfully',
            data: {
                teamMember,
                teamLeader: teamLeader || null
            }
        });

    } catch (error: any) {
        console.error('Error fetching team member details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team member details',
            error: error.message
        });
    }
};

// Get team hierarchy (multi-level team structure)
export const getTeamHierarchy = async (req: Request, res: Response) => {
    try {
        const { inviteCode } = req.params;

        if (!inviteCode) {
            return res.status(400).json({
                success: false,
                message: 'Invite code is required.'
            });
        }

        // Find the team leader
        const teamLeader = await UserModel.findOne({ referralCode: inviteCode })
            .select('name uid phoneNumber plan referralCode totalBalance totalInvites level');

        if (!teamLeader) {
            return res.status(404).json({
                success: false,
                message: 'Team leader not found.'
            });
        }

        // Find direct team members (level 1)
        const directMembers = await UserModel.find({ inviteCode: inviteCode })
            .select('name uid phoneNumber plan referralCode totalBalance totalInvites level createdAt')
            .sort({ createdAt: -1 });

        // Find indirect team members (level 2 - members invited by direct members)
        const indirectMembers = [];
        for (const member of directMembers) {
            if (member.referralCode) {
                const subMembers = await UserModel.find({ inviteCode: member.referralCode })
                    .select('name uid phoneNumber plan totalBalance totalInvites level createdAt')
                    .sort({ createdAt: -1 });

                if (subMembers.length > 0) {
                    indirectMembers.push({
                        invitedBy: member,
                        members: subMembers
                    });
                }
            }
        }

        // Calculate comprehensive statistics
        const allIndirectMembersFlat = indirectMembers.flatMap(group => group.members);
        const allMembers = [...directMembers, ...allIndirectMembersFlat];

        const hierarchyStats = {
            totalDirectMembers: directMembers.length,
            totalIndirectMembers: allIndirectMembersFlat.length,
            totalAllMembers: allMembers.length,
            totalTeamBalance: allMembers.reduce((sum, member) => sum + member.totalBalance, 0),
            activeMembers: allMembers.filter(member => member.level > 0).length
        };

        res.status(200).json({
            success: true,
            message: 'Team hierarchy retrieved successfully',
            data: {
                teamLeader,
                directMembers,
                indirectMembers,
                hierarchyStats
            }
        });

    } catch (error: any) {
        console.error('Error fetching team hierarchy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team hierarchy',
            error: error.message
        });
    }
}; 