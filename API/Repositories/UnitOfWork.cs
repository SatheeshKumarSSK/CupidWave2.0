using API.Data;
using API.Interfaces;

namespace API.Repositories
{
    public class UnitOfWork(IUserRepository userRepository, ILikesRepository likesRepository,
        IMessageRepository messageRepository, DataContext context) : IUnitOfWork
    {
        public IUserRepository UserRepository => userRepository;

        public ILikesRepository LikesRepository => likesRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
